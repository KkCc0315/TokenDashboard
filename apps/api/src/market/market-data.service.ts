import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { MARKET_OVERVIEW, TOKENS, type TokenRecord } from "../common/mock-data";
import { PrismaService } from "../database/prisma.service";

export type MarketOverviewSnapshot = {
  updatedAt: string;
  cacheStatus: "warm" | "refreshing";
  dominance: string;
  fearGreed: number;
  trending: string[];
};

type RefreshResult = {
  persisted: boolean;
  tokens: TokenRecord[];
  overview: MarketOverviewSnapshot;
};

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);
  private readonly tokenOrder = new Map(TOKENS.map((token, index) => [token.id, index]));
  private hasLoggedPersistenceFallback = false;

  constructor(private readonly prisma: PrismaService) {}

  async getTokens(): Promise<TokenRecord[]> {
    try {
      const tokens = await this.prisma.refreshedToken.findMany();

      if (tokens.length > 0) {
        return this.sortTokens(tokens.map((token) => this.mapTokenRecord(token)));
      }
    } catch (error) {
      this.logger.debug(`Falling back to generated token data: ${String(error)}`);
    }

    return this.buildSyntheticTokens(new Date());
  }

  async getToken(id: string): Promise<TokenRecord | undefined> {
    try {
      const token = await this.prisma.refreshedToken.findUnique({
        where: { tokenId: id }
      });

      if (token) {
        return this.mapTokenRecord(token);
      }
    } catch (error) {
      this.logger.debug(`Falling back to generated token ${id}: ${String(error)}`);
    }

    return this.buildSyntheticTokens(new Date()).find((token) => token.id === id);
  }

  async getOverview(): Promise<MarketOverviewSnapshot> {
    try {
      const overview = await this.prisma.marketOverview.findUnique({
        where: { id: "latest" }
      });

      if (overview) {
        return this.mapOverview(overview);
      }
    } catch (error) {
      this.logger.debug(`Falling back to generated market overview: ${String(error)}`);
    }

    const now = new Date();
    return this.buildOverview(this.buildSyntheticTokens(now), now);
  }

  async refreshSnapshot(): Promise<RefreshResult> {
    const now = new Date();
    const tokens = this.buildSyntheticTokens(now);
    const overview = this.buildOverview(tokens, now);

    try {
      await this.prisma.$transaction([
        ...tokens.map((token) =>
          this.prisma.refreshedToken.upsert({
            where: { tokenId: token.id },
            update: {
              name: token.name,
              symbol: token.symbol,
              chain: token.chain,
              category: token.category,
              price: token.price,
              change24h: token.change24h,
              marketCap: token.marketCap,
              volume24h: token.volume24h,
              liquidity: token.liquidity,
              holders: token.holders,
              description: token.description
            },
            create: {
              tokenId: token.id,
              name: token.name,
              symbol: token.symbol,
              chain: token.chain,
              category: token.category,
              price: token.price,
              change24h: token.change24h,
              marketCap: token.marketCap,
              volume24h: token.volume24h,
              liquidity: token.liquidity,
              holders: token.holders,
              description: token.description
            }
          })
        ),
        this.prisma.marketOverview.upsert({
          where: { id: "latest" },
          update: {
            updatedAt: new Date(overview.updatedAt),
            cacheStatus: overview.cacheStatus,
            dominance: overview.dominance,
            fearGreed: overview.fearGreed,
            trending: overview.trending as Prisma.InputJsonValue
          },
          create: {
            id: "latest",
            updatedAt: new Date(overview.updatedAt),
            cacheStatus: overview.cacheStatus,
            dominance: overview.dominance,
            fearGreed: overview.fearGreed,
            trending: overview.trending as Prisma.InputJsonValue
          }
        })
      ]);

      return {
        persisted: true,
        tokens,
        overview
      };
    } catch (error) {
      if (!this.hasLoggedPersistenceFallback) {
        this.logger.warn("Market refresh could not be persisted. Continuing with generated snapshots.");
        this.hasLoggedPersistenceFallback = true;
      }
      this.logger.debug(String(error));

      return {
        persisted: false,
        tokens,
        overview
      };
    }
  }

  private buildSyntheticTokens(now: Date): TokenRecord[] {
    const bucket = Math.floor(now.getTime() / 60000);

    return this.sortTokens(
      TOKENS.map((token, index) => {
        const drift = Math.sin((bucket + index * 11) / 18) * 0.025 + Math.cos((bucket + index * 7) / 33) * 0.01;
        const priceMultiplier = 1 + drift;
        const volumeMultiplier = 1 + Math.abs(drift) * 3.2;

        return {
          ...token,
          price: this.round(token.price * priceMultiplier, token.price < 2 ? 4 : 2),
          change24h: this.round(token.change24h + drift * 180, 2),
          marketCap: this.round(token.marketCap * priceMultiplier, 0),
          volume24h: this.round(token.volume24h * volumeMultiplier, 0)
        };
      })
    );
  }

  private buildOverview(tokens: TokenRecord[], now: Date): MarketOverviewSnapshot {
    const averageChange = tokens.reduce((total, token) => total + token.change24h, 0) / tokens.length;
    const trending = [...tokens]
      .sort((left, right) => right.change24h - left.change24h)
      .slice(0, 3)
      .map((token) => token.symbol);

    return {
      updatedAt: now.toISOString(),
      cacheStatus: "warm",
      dominance: `BTC ${this.round(51.2 + averageChange * 0.18, 1)}% / ETH ${this.round(16.9 + averageChange * 0.08, 1)}%`,
      fearGreed: this.clamp(Math.round(MARKET_OVERVIEW.fearGreed + averageChange * 2.4), 0, 100),
      trending
    };
  }

  private mapTokenRecord(token: {
    tokenId: string;
    name: string;
    symbol: string;
    chain: string;
    category: string;
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
    liquidity: string;
    holders: string;
    description: string;
  }): TokenRecord {
    return {
      id: token.tokenId,
      name: token.name,
      symbol: token.symbol,
      chain: token.chain,
      category: token.category,
      price: token.price,
      change24h: token.change24h,
      marketCap: token.marketCap,
      volume24h: token.volume24h,
      liquidity: token.liquidity,
      holders: token.holders,
      description: token.description
    };
  }

  private mapOverview(overview: {
    updatedAt: Date;
    cacheStatus: string;
    dominance: string;
    fearGreed: number;
    trending: unknown;
  }): MarketOverviewSnapshot {
    return {
      updatedAt: overview.updatedAt.toISOString(),
      cacheStatus: overview.cacheStatus === "refreshing" ? "refreshing" : "warm",
      dominance: overview.dominance,
      fearGreed: overview.fearGreed,
      trending: Array.isArray(overview.trending)
        ? overview.trending.map((entry) => String(entry))
        : MARKET_OVERVIEW.trending
    };
  }

  private sortTokens(tokens: TokenRecord[]) {
    return [...tokens].sort(
      (left, right) =>
        (this.tokenOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
        (this.tokenOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER)
    );
  }

  private round(value: number, digits: number) {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }
}
