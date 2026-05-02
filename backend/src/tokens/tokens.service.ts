import { Injectable, Logger } from '@nestjs/common';

import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';
import { ListTokensQueryDto } from './dto/list-tokens-query.dto';
import { TokenProviderService } from './token-provider.service';

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly prismaService: PrismaService,
    private readonly tokenProviderService: TokenProviderService,
  ) {}

  async getTokens(query: ListTokensQueryDto) {
    const key = `tokens:list:${JSON.stringify({
      page: query.page,
      limit: query.limit,
      search: query.search?.trim().toLowerCase() ?? '',
      sortBy: query.sortBy,
    })}`;

    const cached = await this.cacheService.get(key);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.tokenProviderService.fetchTokens(query);
      await this.cacheService.set(key, response, 60);
      return response;
    } catch (error) {
      await this.logProviderFailure('/coins/markets', error);
      throw error;
    }
  }

  async getTokenDetail(symbol: string) {
    const key = `token:detail:${symbol.trim().toUpperCase()}`;
    const cached = await this.cacheService.get(key);

    if (cached) {
      return cached;
    }

    try {
      const response = await this.tokenProviderService.fetchTokenDetail(symbol);
      await this.cacheService.set(key, response, 120);
      return response;
    } catch (error) {
      await this.logProviderFailure(`/coins/${symbol}`, error);
      throw error;
    }
  }

  private async logProviderFailure(endpoint: string, error: unknown): Promise<void> {
    const message = error instanceof Error ? error.message : 'Unknown token provider error';
    this.logger.error(`Token provider failure on ${endpoint}: ${message}`);

    try {
      await this.prismaService.apiSyncLog.create({
        data: {
          provider: 'token-provider',
          endpoint,
          status: 'ERROR',
          message,
        },
      });
    } catch (loggingError) {
      const details =
        loggingError instanceof Error ? loggingError.message : 'Unknown logging error';
      this.logger.warn(`Unable to persist token sync log: ${details}`);
    }
  }
}
