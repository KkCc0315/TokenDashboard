"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WatchlistService = class WatchlistService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getWatchlist(userId) {
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
    async addItem(userId, addWatchlistItemDto) {
        const watchlist = await this.findOrCreateDefaultWatchlist(userId);
        const symbol = addWatchlistItemDto.tokenSymbol.trim().toUpperCase();
        const existingItem = await this.prismaService.watchlistItem.findFirst({
            where: {
                watchlistId: watchlist.id,
                tokenSymbol: symbol,
            },
        });
        if (existingItem) {
            throw new common_1.BadRequestException('This token is already in your watchlist.');
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
    async removeItem(userId, itemId) {
        const watchlist = await this.findOrCreateDefaultWatchlist(userId);
        const item = await this.prismaService.watchlistItem.findFirst({
            where: {
                id: itemId,
                watchlistId: watchlist.id,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Watchlist item not found.');
        }
        await this.prismaService.watchlistItem.delete({
            where: { id: itemId },
        });
        return {
            message: 'Token removed from watchlist.',
        };
    }
    findOrCreateDefaultWatchlist(userId) {
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
};
exports.WatchlistService = WatchlistService;
exports.WatchlistService = WatchlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WatchlistService);
//# sourceMappingURL=watchlist.service.js.map