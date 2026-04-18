import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CacheService } from "../cache/cache.service";
import { MarketDataService } from "../market/market-data.service";
import { WatchlistService } from "../watchlist/watchlist.service";

@Injectable()
export class MarketAlertJobsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MarketAlertJobsService.name);
  private refreshTimer?: NodeJS.Timeout;
  private alertTimer?: NodeJS.Timeout;
  private refreshRunning = false;
  private alertRunning = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly marketDataService: MarketDataService,
    private readonly watchlistService: WatchlistService
  ) {}

  onModuleInit() {
    const refreshMs = this.getIntervalMs("marketRefreshIntervalSeconds", 60);
    const alertMs = this.getIntervalMs("alertEvaluationIntervalSeconds", refreshMs / 1000);

    void this.runRefreshJob();
    void this.runAlertEvaluationJob();

    this.refreshTimer = setInterval(() => {
      void this.runRefreshJob();
    }, refreshMs);
    this.refreshTimer.unref();

    this.alertTimer = setInterval(() => {
      void this.runAlertEvaluationJob();
    }, alertMs);
    this.alertTimer.unref();

    this.logger.log(
      `Scheduled market refresh every ${Math.round(refreshMs / 1000)}s and alert evaluation every ${Math.round(alertMs / 1000)}s.`
    );
  }

  onModuleDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    if (this.alertTimer) {
      clearInterval(this.alertTimer);
    }
  }

  private async runRefreshJob() {
    if (this.refreshRunning) {
      return;
    }

    this.refreshRunning = true;

    try {
      const result = await this.marketDataService.refreshSnapshot();
      this.cacheService.delete("market:overview");
      this.cacheService.deleteByPrefix("token:");
      this.cacheService.deleteByPrefix("tokens:");

      if (result.persisted) {
        this.logger.debug(`Refreshed ${result.tokens.length} tokens at ${result.overview.updatedAt}.`);
      }
    } finally {
      this.refreshRunning = false;
    }
  }

  private async runAlertEvaluationJob() {
    if (this.alertRunning) {
      return;
    }

    this.alertRunning = true;

    try {
      const triggeredCount = await this.watchlistService.evaluateAlerts();

      if (triggeredCount > 0) {
        this.logger.log(`Triggered ${triggeredCount} alert event(s).`);
      }
    } finally {
      this.alertRunning = false;
    }
  }

  private getIntervalMs(key: string, fallbackSeconds: number) {
    const seconds = this.configService.get<number>(key, fallbackSeconds);
    return Math.max(15, seconds) * 1000;
  }
}
