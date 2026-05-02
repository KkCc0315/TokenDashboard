import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { WalletLookupDto } from './dto/wallet-lookup.dto';
import { WalletHolding, WalletLookupResponse } from './wallet.types';

@Injectable()
export class WalletProviderService {
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'WALLET_PROVIDER_BASE_URL',
      'https://deep-index.moralis.io/api/v2.2',
    );
    this.apiKey = this.configService.get<string>('WALLET_PROVIDER_API_KEY') || undefined;
  }

  async lookupWallet(dto: WalletLookupDto): Promise<WalletLookupResponse> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException(
        'Wallet provider is not configured. Supply provider credentials in the environment.',
      );
    }

    const { data } = await this.httpService.axiosRef.get<unknown>(
      `${this.baseUrl}/wallets/${dto.address}/tokens`,
      {
        timeout: 5_000,
        params: {
          chain: dto.chain,
        },
        headers: {
          'X-API-Key': this.apiKey,
        },
      },
    );

    const rawHoldings = Array.isArray(data)
      ? data
      : Array.isArray((data as { result?: unknown[] }).result)
        ? (data as { result: unknown[] }).result
        : [];

    const holdings = rawHoldings.map((holding) =>
      this.mapHolding(holding as Record<string, unknown>),
    );

    return {
      address: dto.address,
      chain: dto.chain,
      totalTokens: holdings.length,
      holdings,
    };
  }

  private mapHolding(holding: Record<string, unknown>): WalletHolding {
    return {
      tokenAddress:
        typeof holding.token_address === 'string' ? holding.token_address : null,
      symbol: typeof holding.symbol === 'string' ? holding.symbol : 'UNKNOWN',
      name: typeof holding.name === 'string' ? holding.name : 'Unknown token',
      balance:
        typeof holding.balance_formatted === 'string'
          ? holding.balance_formatted
          : typeof holding.balance === 'string'
            ? holding.balance
            : '0',
      usdValue:
        typeof holding.usd_value === 'number'
          ? holding.usd_value
          : typeof holding.usd_value_24hr_usd_change === 'number'
            ? holding.usd_value_24hr_usd_change
            : null,
    };
  }
}
