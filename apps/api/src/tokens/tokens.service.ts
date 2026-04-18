import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CacheService } from "../cache/cache.service";
import { MarketDataService } from "../market/market-data.service";
import { TokenQueryDto } from "./dto/token-query.dto";

@Injectable()
export class TokensService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly marketDataService: MarketDataService
  ) {}

  async findAll(query: TokenQueryDto) {
    const ttl = this.configService.get<number>("marketCacheTtl", 45);
    const key = `tokens:${JSON.stringify(query)}`;

    return this.cacheService.getOrSet(key, ttl, async () => {
      const tokens = await this.marketDataService.getTokens();
      const search = query.search?.toLowerCase().trim();

      return tokens.filter((token) => {
        const matchesSearch =
          !search || token.name.toLowerCase().includes(search) || token.symbol.toLowerCase().includes(search);
        const matchesChain = !query.chain || query.chain === "All" || token.chain === query.chain;
        const matchesCategory = !query.category || query.category === "All" || token.category === query.category;

        return matchesSearch && matchesChain && matchesCategory;
      });
    });
  }

  async findOne(id: string) {
    const ttl = this.configService.get<number>("marketCacheTtl", 45);
    const token = await this.cacheService.getOrSet(`token:${id}`, ttl, () => this.marketDataService.getToken(id));

    if (!token) {
      throw new NotFoundException(`Token ${id} was not found`);
    }

    return token;
  }
}
