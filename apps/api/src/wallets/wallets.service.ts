import { Injectable, NotFoundException } from "@nestjs/common";
import { WALLET } from "../common/mock-data";

@Injectable()
export class WalletsService {
  findOne(address: string) {
    if (address === "demo-wallet") {
      return WALLET;
    }

    throw new NotFoundException(`Wallet ${address} was not found`);
  }
}
