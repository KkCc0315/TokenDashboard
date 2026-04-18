import { AlertCondition, AlertState } from "@prisma/client";
import { WatchlistService } from "./watchlist.service";

function buildMockItem(overrides: Partial<any> = {}) {
  return {
    id: "item-1",
    tokenId: "sol",
    userId: "user-1",
    note: "test",
    targetPrice: 200,
    alertCondition: AlertCondition.ABOVE,
    alertState: AlertState.ARMED,
    lastEvaluatedPrice: null,
    lastTriggeredPrice: null,
    lastTriggeredAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

describe("WatchlistService", () => {
  let service: WatchlistService;
  let mockPrisma: any;
  let mockMarketDataService: any;

  beforeEach(() => {
    mockPrisma = {
      watchlistItem: {
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn().mockResolvedValue({}),
        upsert: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({})
      },
      alertEvent: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({})
      },
      $transaction: jest.fn().mockResolvedValue([])
    };

    mockMarketDataService = {
      getTokens: jest
        .fn()
        .mockResolvedValue([
          { id: "sol", price: 170, name: "Solana", symbol: "SOL", chain: "Solana", category: "Layer 1" }
        ])
    };

    service = new WatchlistService(mockPrisma, mockMarketDataService);
  });

  describe("evaluateAlerts", () => {
    it("triggers an ABOVE alert when price exceeds target", async () => {
      const item = buildMockItem({ targetPrice: 150, alertCondition: AlertCondition.ABOVE });
      mockPrisma.watchlistItem.findMany.mockResolvedValue([item]);

      const triggered = await service.evaluateAlerts();

      expect(triggered).toBe(1);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      const operations = mockPrisma.$transaction.mock.calls[0][0];
      expect(operations.length).toBeGreaterThanOrEqual(2);
    });

    it("triggers a BELOW alert when price drops below target", async () => {
      const item = buildMockItem({ targetPrice: 200, alertCondition: AlertCondition.BELOW });
      mockPrisma.watchlistItem.findMany.mockResolvedValue([item]);

      const triggered = await service.evaluateAlerts();

      expect(triggered).toBe(1);
    });

    it("does not trigger when price has not crossed threshold", async () => {
      const item = buildMockItem({ targetPrice: 200, alertCondition: AlertCondition.ABOVE });
      mockPrisma.watchlistItem.findMany.mockResolvedValue([item]);

      const triggered = await service.evaluateAlerts();

      expect(triggered).toBe(0);
    });

    it("does not re-trigger an already TRIGGERED item", async () => {
      const item = buildMockItem({
        targetPrice: 150,
        alertCondition: AlertCondition.ABOVE,
        alertState: AlertState.TRIGGERED
      });
      mockPrisma.watchlistItem.findMany.mockResolvedValue([item]);

      const triggered = await service.evaluateAlerts();

      expect(triggered).toBe(0);
    });

    it("skips items whose token has no current price", async () => {
      const item = buildMockItem({ tokenId: "unknown-token" });
      mockPrisma.watchlistItem.findMany.mockResolvedValue([item]);

      const triggered = await service.evaluateAlerts();

      expect(triggered).toBe(0);
    });

    it("returns 0 when there are no watchlist items", async () => {
      const triggered = await service.evaluateAlerts();

      expect(triggered).toBe(0);
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });
  });
});
