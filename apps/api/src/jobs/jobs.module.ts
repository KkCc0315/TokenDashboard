import { Module } from "@nestjs/common";
import { MarketModule } from "../market/market.module";
import { WatchlistModule } from "../watchlist/watchlist.module";
import { MarketAlertJobsService } from "./market-alert-jobs.service";

@Module({
  imports: [MarketModule, WatchlistModule],
  providers: [MarketAlertJobsService]
})
export class JobsModule {}
