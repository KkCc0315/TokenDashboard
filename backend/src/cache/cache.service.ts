import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST', '127.0.0.1'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
    });
  }

  private async ensureConnection(): Promise<void> {
    if (this.client.status === 'wait') {
      await this.client.connect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    await this.ensureConnection();
    const raw = await this.client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.ensureConnection();
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.ensureConnection();
    await this.client.del(key);
  }

  async clearByPrefix(prefix: string): Promise<number> {
    await this.ensureConnection();
    const keys = await this.client.keys(`${prefix}*`);

    if (keys.length === 0) {
      return 0;
    }

    const deleted = await this.client.del(...keys);
    this.logger.log(`Cleared ${deleted} cache entr${deleted === 1 ? 'y' : 'ies'} for ${prefix}`);
    return deleted;
  }

  async ping(): Promise<'up' | 'down'> {
    try {
      await this.ensureConnection();
      const result = await this.client.ping();
      return result === 'PONG' ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client.status !== 'end') {
      await this.client.quit();
    }
  }
}
