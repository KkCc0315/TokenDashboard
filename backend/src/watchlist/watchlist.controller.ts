import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AddWatchlistItemDto } from './dto/add-watchlist-item.dto';
import { WatchlistService } from './watchlist.service';

@UseGuards(JwtAuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  getWatchlist(@CurrentUser() user: AuthenticatedUser) {
    return this.watchlistService.getWatchlist(user.sub);
  }

  @Post()
  addItem(
    @CurrentUser() user: AuthenticatedUser,
    @Body() addWatchlistItemDto: AddWatchlistItemDto,
  ) {
    return this.watchlistService.addItem(user.sub, addWatchlistItemDto);
  }

  @Delete(':id')
  removeItem(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.watchlistService.removeItem(user.sub, id);
  }
}
