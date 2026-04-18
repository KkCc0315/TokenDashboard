import { MarketDataService } from "./market-data.service";
import { TOKENS } from "../common/mock-data";

describe("MarketDataService", () => {
  let service: MarketDataService;

  beforeEach(() => {
    const mockPrisma = {
      refreshedToken: { findMany: jest.fn().mockResolvedValue([]), findUnique: jest.fn().mockResolvedValue(null) },
      marketOverview: { findUnique: jest.fn().mockResolvedValue(null) }
    };
    service = new MarketDataService(mockPrisma as any);
  });

  describe("getTokens", () => {
    it("returns all seed tokens when DB is empty", async () => {
      const tokens = await service.getTokens();

      expect(tokens).toHaveLength(TOKENS.length);
      for (const token of tokens) {
        expect(token).toHaveProperty("id");
        expect(token).toHaveProperty("price");
        expect(token.price).toBeGreaterThan(0);
      }
    });

    it("preserves the seed token order", async () => {
      const tokens = await service.getTokens();
      const ids = tokens.map((t) => t.id);

      expect(ids).toEqual(TOKENS.map((t) => t.id));
    });
  });

  describe("getToken", () => {
    it("returns a specific token by id", async () => {
      const token = await service.getToken("sol");

      expect(token).toBeDefined();
      expect(token!.id).toBe("sol");
      expect(token!.symbol).toBe("SOL");
    });

    it("returns undefined for unknown id", async () => {
      const token = await service.getToken("nonexistent");

      expect(token).toBeUndefined();
    });
  });

  describe("getOverview", () => {
    it("returns a valid market overview", async () => {
      const overview = await service.getOverview();

      expect(overview).toHaveProperty("updatedAt");
      expect(overview).toHaveProperty("cacheStatus", "warm");
      expect(overview).toHaveProperty("dominance");
      expect(overview).toHaveProperty("fearGreed");
      expect(overview.fearGreed).toBeGreaterThanOrEqual(0);
      expect(overview.fearGreed).toBeLessThanOrEqual(100);
      expect(overview).toHaveProperty("trending");
      expect(overview.trending).toHaveLength(3);
    });
  });
});
