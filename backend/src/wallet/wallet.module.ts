import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { WalletController } from './wallet.controller';
import { WalletProviderService } from './wallet-provider.service';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5_000,
      maxRedirects: 3,
    }),
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletProviderService],
})
export class WalletModule {}
