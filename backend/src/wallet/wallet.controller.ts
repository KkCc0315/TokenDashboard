import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '../common/decorators/public.decorator';
import { WalletLookupDto } from './dto/wallet-lookup.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Public()
  @Post('lookup')
  lookup(@Body() walletLookupDto: WalletLookupDto) {
    return this.walletService.lookupWallet(walletLookupDto);
  }
}
