import { Controller, Get, Param } from "@nestjs/common";
import { WalletsService } from "./wallets.service";

@Controller("wallets")
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get(":address")
  findOne(@Param("address") address: string) {
    return this.walletsService.findOne(address);
  }
}
