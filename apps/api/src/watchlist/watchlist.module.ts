import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { MarketModule } from "../market/market.module";
import { WatchlistController } from "./watchlist.controller";
import { WatchlistService } from "./watchlist.service";

@Module({
  imports: [AuthModule, MarketModule],
  controllers: [WatchlistController],
  providers: [WatchlistService],
  exports: [WatchlistService]
})
export class WatchlistModule {}
