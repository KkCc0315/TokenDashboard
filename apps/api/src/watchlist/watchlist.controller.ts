import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthenticatedUser } from "../auth/authenticated-user.interface";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateWatchlistItemDto } from "./dto/create-watchlist-item.dto";
import { WatchlistService } from "./watchlist.service";

@Controller("watchlist")
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.watchlistService.findAll(user.id);
  }

  @Get("alerts")
  findAlerts(@CurrentUser() user: AuthenticatedUser) {
    return this.watchlistService.findAlerts(user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() payload: CreateWatchlistItemDto) {
    return this.watchlistService.create(user.id, payload);
  }

  @Delete(":tokenId")
  remove(@CurrentUser() user: AuthenticatedUser, @Param("tokenId") tokenId: string) {
    return this.watchlistService.remove(user.id, tokenId);
  }
}
