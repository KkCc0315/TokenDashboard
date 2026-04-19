import { CacheService } from "./cache.service";

describe("CacheService", () => {
  let service: CacheService;

  beforeEach(() => {
    service = new CacheService();
  });

  afterEach(() => {
    service.onModuleDestroy();
  });

  describe("getOrSet", () => {
    it("calls factory on cache miss and caches the result", async () => {
      const factory = jest.fn().mockResolvedValue("value");

      const result1 = await service.getOrSet("key", 60, factory);
      const result2 = await service.getOrSet("key", 60, factory);

      expect(result1).toBe("value");
      expect(result2).toBe("value");
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it("calls factory again after TTL expires", async () => {
      const factory = jest.fn().mockResolvedValue("value");
      jest.useFakeTimers();

      await service.getOrSet("key", 1, factory);
      jest.advanceTimersByTime(2000);
      await service.getOrSet("key", 1, factory);

      expect(factory).toHaveBeenCalledTimes(2);
      jest.useRealTimers();
    });
  });

  describe("get / set", () => {
    it("returns cached value within TTL", () => {
      service.set("k", "v", 60);
      expect(service.get("k")).toBe("v");
    });

    it("returns undefined after TTL expires", () => {
      jest.useFakeTimers();
      service.set("k", "v", 1);
      jest.advanceTimersByTime(2000);
      expect(service.get("k")).toBeUndefined();
      jest.useRealTimers();
    });
  });

  describe("delete", () => {
    it("removes a cached entry", async () => {
      await service.getOrSet("key", 60, () => "value");
      service.delete("key");
      expect(service.get("key")).toBeUndefined();
    });
  });

  describe("deleteByPrefix", () => {
    it("removes all entries matching prefix", async () => {
      await service.getOrSet("tokens:a", 60, () => "a");
      await service.getOrSet("tokens:b", 60, () => "b");
      await service.getOrSet("user:1", 60, () => "u");

      service.deleteByPrefix("tokens:");

      expect(service.get("tokens:a")).toBeUndefined();
      expect(service.get("tokens:b")).toBeUndefined();
      expect(service.get("user:1")).toBe("u");
    });
  });

  describe("eviction", () => {
    it("cleans up expired entries periodically", () => {
      jest.useFakeTimers();
      service.onModuleInit();

      service.set("a", "1", 1);
      service.set("b", "2", 120);

      jest.advanceTimersByTime(61_000);

      expect(service.get("a")).toBeUndefined();
      expect(service.get("b")).toBe("2");

      jest.useRealTimers();
    });
  });
});
