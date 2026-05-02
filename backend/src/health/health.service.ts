import { Injectable } from '@nestjs/common';

import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async getHealth() {
    const database = await this.checkDatabase();
    const redis = await this.cacheService.ping();

    return {
      status: database === 'up' && redis === 'up' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database,
        redis,
      },
    };
  }

  private async checkDatabase(): Promise<'up' | 'down'> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return 'up';
    } catch {
      return 'down';
    }
  }
}
