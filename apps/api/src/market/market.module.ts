import { Module } from "@nestjs/common";
import { MarketController } from "./market.controller";
import { MarketDataService } from "./market-data.service";
import { MarketService } from "./market.service";

@Module({
  controllers: [MarketController],
  providers: [MarketService, MarketDataService],
  exports: [MarketDataService]
})
export class MarketModule {}
