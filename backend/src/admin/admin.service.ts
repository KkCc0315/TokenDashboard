import { Injectable } from '@nestjs/common';

import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly prismaService: PrismaService,
  ) {}

  async clearCache() {
    const [tokenLists, tokenDetails, walletLookups] = await Promise.all([
      this.cacheService.clearByPrefix('tokens:list:'),
      this.cacheService.clearByPrefix('token:detail:'),
      this.cacheService.clearByPrefix('wallet:lookup:'),
    ]);

    const totalCleared = tokenLists + tokenDetails + walletLookups;

    await this.prismaService.apiSyncLog.create({
      data: {
        provider: 'admin',
        endpoint: '/admin/cache/clear',
        status: 'SUCCESS',
        message: `Cleared ${totalCleared} cache entries`,
      },
    });

    return {
      message: 'Cache cleared successfully.',
      cleared: {
        tokenLists,
        tokenDetails,
        walletLookups,
        total: totalCleared,
      },
    };
  }
}
