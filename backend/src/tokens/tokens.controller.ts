import { Controller, Get, Param, Query } from '@nestjs/common';

import { Public } from '../common/decorators/public.decorator';
import { ListTokensQueryDto } from './dto/list-tokens-query.dto';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Public()
  @Get()
  getTokens(@Query() query: ListTokensQueryDto) {
    return this.tokensService.getTokens(query);
  }

  @Public()
  @Get(':symbol')
  getTokenDetail(@Param('symbol') symbol: string) {
    return this.tokensService.getTokenDetail(symbol);
  }
}
