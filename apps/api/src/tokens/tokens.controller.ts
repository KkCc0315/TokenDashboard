import { Controller, Get, Param, Query } from "@nestjs/common";
import { TokenQueryDto } from "./dto/token-query.dto";
import { TokensService } from "./tokens.service";

@Controller("tokens")
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  findAll(@Query() query: TokenQueryDto) {
    return this.tokensService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tokensService.findOne(id);
  }
}
