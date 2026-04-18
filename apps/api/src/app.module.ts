import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { DatabaseModule } from "./database/database.module";
import { JobsModule } from "./jobs/jobs.module";
import { MarketModule } from "./market/market.module";
import { TokensModule } from "./tokens/tokens.module";
import { UsersModule } from "./users/users.module";
import { WalletsModule } from "./wallets/wallets.module";
import { WatchlistModule } from "./watchlist/watchlist.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    DatabaseModule,
    CacheModule,
    AuthModule,
    UsersModule,
    TokensModule,
    WalletsModule,
    WatchlistModule,
    MarketModule,
    JobsModule
  ]
})
export class AppModule {}
