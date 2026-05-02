import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { ListTokensQueryDto } from './dto/list-tokens-query.dto';
import { TokenDetailResponse, TokenListItem, TokenListResponse } from './token.types';

interface CoinGeckoMarketToken {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
  total_volume: number;
  image: string | null;
}

@Injectable()
export class TokenProviderService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'TOKEN_PROVIDER_BASE_URL',
      'https://api.coingecko.com/api/v3',
    );
  }

  async fetchTokens(query: ListTokensQueryDto): Promise<TokenListResponse> {
    const { data } = await this.httpService.axiosRef.get<CoinGeckoMarketToken[]>(
      `${this.baseUrl}/coins/markets`,
      {
        timeout: 5_000,
        params: {
          vs_currency: 'usd',
          order: this.mapSort(query.sortBy),
          page: query.page,
          per_page: query.limit,
          sparkline: false,
          price_change_percentage: '24h',
        },
      },
    );

    let items = data.map((token) => this.mapListItem(token));

    if (query.search) {
      const search = query.search.trim().toLowerCase();
      items = items.filter(
        (token) =>
          token.name.toLowerCase().includes(search) ||
          token.symbol.toLowerCase().includes(search),
      );
    }

    items = this.sortItems(items, query.sortBy);

    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        count: items.length,
        sortBy: query.sortBy,
        search: query.search?.trim() || null,
      },
    };
  }

  async fetchTokenDetail(symbol: string): Promise<TokenDetailResponse> {
    const normalizedSymbol = symbol.trim().toLowerCase();
    const searchResponse = await this.httpService.axiosRef.get<{
      coins?: Array<{ id: string; symbol: string; name: string }>;
    }>(`${this.baseUrl}/search`, {
      timeout: 5_000,
      params: {
        query: normalizedSymbol,
      },
    });

    const coins = searchResponse.data.coins ?? [];
    const match =
      coins.find((coin) => coin.symbol.toLowerCase() === normalizedSymbol) ?? coins[0];

    if (!match) {
      throw new HttpException(`Token ${symbol} was not found.`, 404);
    }

    const { data } = await this.httpService.axiosRef.get<{
      id: string;
      name: string;
      symbol: string;
      image?: { large?: string };
      description?: { en?: string };
      links?: { homepage?: string[]; blockchain_site?: string[] };
      market_data?: {
        current_price?: Record<string, number>;
        market_cap?: Record<string, number>;
        total_volume?: Record<string, number>;
        price_change_percentage_24h?: number;
      };
      platforms?: Record<string, string>;
    }>(`${this.baseUrl}/coins/${match.id}`, {
      timeout: 5_000,
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });

    const platformEntries = Object.entries(data.platforms ?? {}).filter(
      ([, address]) => Boolean(address),
    );
    const [chain, contractAddress] = platformEntries[0] ?? [null, null];

    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      price: data.market_data?.current_price?.usd ?? null,
      marketCap: data.market_data?.market_cap?.usd ?? null,
      volume24h: data.market_data?.total_volume?.usd ?? null,
      change24h: data.market_data?.price_change_percentage_24h ?? null,
      contractAddress,
      chain,
      description: data.description?.en?.slice(0, 400) ?? null,
      homepage: data.links?.homepage?.find(Boolean) ?? null,
      explorer: data.links?.blockchain_site?.find(Boolean) ?? null,
      imageUrl: data.image?.large ?? null,
    };
  }

  private mapListItem(token: CoinGeckoMarketToken): TokenListItem {
    return {
      name: token.name,
      symbol: token.symbol.toUpperCase(),
      price: token.current_price,
      change24h: token.price_change_percentage_24h ?? 0,
      marketCap: token.market_cap,
      volume24h: token.total_volume,
      chain: null,
      imageUrl: token.image,
    };
  }

  private mapSort(sortBy: ListTokensQueryDto['sortBy']): string {
    switch (sortBy) {
      case 'price':
        return 'market_cap_desc';
      case 'change24h':
        return 'market_cap_desc';
      case 'volume':
        return 'volume_desc';
      case 'marketCap':
      default:
        return 'market_cap_desc';
    }
  }

  private sortItems(items: TokenListItem[], sortBy: ListTokensQueryDto['sortBy']) {
    const sorted = [...items];

    sorted.sort((left, right) => {
      switch (sortBy) {
        case 'price':
          return right.price - left.price;
        case 'change24h':
          return right.change24h - left.change24h;
        case 'volume':
          return right.volume24h - left.volume24h;
        case 'marketCap':
        default:
          return right.marketCap - left.marketCap;
      }
    });

    return sorted;
  }
}
