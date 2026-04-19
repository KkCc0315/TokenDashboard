import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly store = new Map<string, CacheEntry<unknown>>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  onModuleInit() {
    this.cleanupInterval = setInterval(() => this.evictExpired(), 60_000);
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  async getOrSet<T>(key: string, ttlSeconds: number, factory: () => T | Promise<T>): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await factory();
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });

    return value;
  }

  get<T>(key: string): T | undefined {
    const now = Date.now();
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (entry && entry.expiresAt > now) {
      return entry.value;
    }
    if (entry) {
      this.store.delete(key);
    }
    return undefined;
  }

  set<T>(key: string, value: T, ttlSeconds: number) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  delete(key: string) {
    this.store.delete(key);
  }

  deleteByPrefix(prefix: string) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  private evictExpired() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt <= now) {
        this.store.delete(key);
      }
    }
  }
}
