import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AddWatchlistItemDto } from './dto/add-watchlist-item.dto';

@Injectable()
export class WatchlistService {
  constructor(private readonly prismaService: PrismaService) {}

  async getWatchlist(userId: string) {
    const watchlist = await this.findOrCreateDefaultWatchlist(userId);

    return {
      id: watchlist.id,
      name: watchlist.name,
      items: watchlist.items.map((item) => ({
        id: item.id,
        tokenSymbol: item.tokenSymbol,
        tokenName: item.tokenName,
        contractAddress: item.contractAddress,
        chain: item.chain,
        createdAt: item.createdAt,
      })),
    };
  }

  async addItem(userId: string, addWatchlistItemDto: AddWatchlistItemDto) {
    const watchlist = await this.findOrCreateDefaultWatchlist(userId);
    const symbol = addWatchlistItemDto.tokenSymbol.trim().toUpperCase();

    const existingItem = await this.prismaService.watchlistItem.findFirst({
      where: {
        watchlistId: watchlist.id,
        tokenSymbol: symbol,
      },
    });

    if (existingItem) {
      throw new BadRequestException('This token is already in your watchlist.');
    }

    const item = await this.prismaService.watchlistItem.create({
      data: {
        watchlistId: watchlist.id,
        tokenSymbol: symbol,
        tokenName: addWatchlistItemDto.tokenName.trim(),
        contractAddress: addWatchlistItemDto.contractAddress?.trim(),
        chain: addWatchlistItemDto.chain?.trim(),
      },
    });

    return {
      message: 'Token added to watchlist.',
      item,
    };
  }

  async removeItem(userId: string, itemId: string) {
    const watchlist = await this.findOrCreateDefaultWatchlist(userId);

    const item = await this.prismaService.watchlistItem.findFirst({
      where: {
        id: itemId,
        watchlistId: watchlist.id,
      },
    });

    if (!item) {
      throw new NotFoundException('Watchlist item not found.');
    }

    await this.prismaService.watchlistItem.delete({
      where: { id: itemId },
    });

    return {
      message: 'Token removed from watchlist.',
    };
  }

  private findOrCreateDefaultWatchlist(userId: string) {
    return this.prismaService.watchlist.upsert({
      where: {
        userId_name: {
          userId,
          name: 'default',
        },
      },
      update: {},
      create: {
        userId,
        name: 'default',
      },
      include: {
        items: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}
