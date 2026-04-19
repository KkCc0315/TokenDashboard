import { NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CacheService } from "../cache/cache.service";
import { MarketDataService } from "../market/market-data.service";
import { TokensService } from "./tokens.service";

describe("TokensService", () => {
  let service: TokensService;
  let cache: CacheService;
  let configService: { get: jest.Mock };
  let marketDataService: { getTokens: jest.Mock; getToken: jest.Mock };

  const mockTokens = [
    { id: "btc", name: "Bitcoin", symbol: "BTC", chain: "Bitcoin", category: "Layer 1", price: 50000 },
    { id: "eth", name: "Ethereum", symbol: "ETH", chain: "Ethereum", category: "Layer 1", price: 3000 },
    { id: "sol", name: "Solana", symbol: "SOL", chain: "Solana", category: "Layer 1", price: 100 }
  ];

  beforeEach(() => {
    cache = new CacheService();
    configService = { get: jest.fn().mockReturnValue(45) };
    marketDataService = {
      getTokens: jest.fn().mockResolvedValue(mockTokens),
      getToken: jest.fn()
    };
    service = new TokensService(
      cache,
      configService as unknown as ConfigService,
      marketDataService as unknown as MarketDataService
    );
  });

  afterEach(() => {
    cache.onModuleDestroy();
  });

  describe("findAll", () => {
    it("returns all tokens with no filters", async () => {
      const result = await service.findAll({});
      expect(result).toHaveLength(3);
    });

    it("filters by search term", async () => {
      const result = await service.findAll({ search: "bit" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("btc");
    });

    it("filters by chain", async () => {
      const result = await service.findAll({ chain: "Ethereum" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("eth");
    });

    it("filters by category", async () => {
      const result = await service.findAll({ category: "Layer 1" });
      expect(result).toHaveLength(3);
    });

    it("returns empty when no match", async () => {
      const result = await service.findAll({ search: "nonexistent" });
      expect(result).toHaveLength(0);
    });

    it("caches results for same query", async () => {
      await service.findAll({});
      await service.findAll({});
      expect(marketDataService.getTokens).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne", () => {
    it("returns a single token", async () => {
      const token = { id: "btc", name: "Bitcoin" };
      marketDataService.getToken.mockResolvedValue(token);

      const result = await service.findOne("btc");
      expect(result).toEqual(token);
    });

    it("throws NotFoundException when token not found", async () => {
      marketDataService.getToken.mockResolvedValue(null);

      await expect(service.findOne("xxx")).rejects.toThrow(NotFoundException);
    });
  });
});
