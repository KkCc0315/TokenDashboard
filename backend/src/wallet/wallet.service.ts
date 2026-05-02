import { Injectable, Logger } from '@nestjs/common';

import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';
import { WalletLookupDto } from './dto/wallet-lookup.dto';
import { WalletProviderService } from './wallet-provider.service';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly prismaService: PrismaService,
    private readonly walletProviderService: WalletProviderService,
  ) {}

  async lookupWallet(dto: WalletLookupDto) {
    const key = `wallet:lookup:${dto.chain}:${dto.address.toLowerCase()}`;
    const cached = await this.cacheService.get(key);

    if (cached) {
      return cached;
    }

    try {
      const response = await this.walletProviderService.lookupWallet(dto);
      await this.cacheService.set(key, response, 120);
      return response;
    } catch (error) {
      await this.logProviderFailure(dto.address, error);
      throw error;
    }
  }

  private async logProviderFailure(address: string, error: unknown): Promise<void> {
    const message = error instanceof Error ? error.message : 'Unknown wallet provider error';
    this.logger.error(`Wallet provider failure on ${address}: ${message}`);

    try {
      await this.prismaService.apiSyncLog.create({
        data: {
          provider: 'wallet-provider',
          endpoint: `/wallet/lookup/${address}`,
          status: 'ERROR',
          message,
        },
      });
    } catch (loggingError) {
      const details =
        loggingError instanceof Error ? loggingError.message : 'Unknown logging error';
      this.logger.warn(`Unable to persist wallet sync log: ${details}`);
    }
  }
}
