import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CacheService } from "../cache/cache.service";
import { MarketDataService } from "./market-data.service";

@Injectable()
export class MarketService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly marketDataService: MarketDataService
  ) {}

  getOverview() {
    const ttl = this.configService.get<number>("marketCacheTtl", 45);
    return this.cacheService.getOrSet("market:overview", ttl, () => this.marketDataService.getOverview());
  }
}
