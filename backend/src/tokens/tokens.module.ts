import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { TokensController } from './tokens.controller';
import { TokenProviderService } from './token-provider.service';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5_000,
      maxRedirects: 3,
    }),
  ],
  controllers: [TokensController],
  providers: [TokensService, TokenProviderService],
})
export class TokensModule {}
