import { PrismaService } from '../prisma/prisma.service';
import { AddWatchlistItemDto } from './dto/add-watchlist-item.dto';
export declare class WatchlistService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    getWatchlist(userId: string): Promise<{
        id: string;
        name: string;
        items: {
            id: string;
            tokenSymbol: string;
            tokenName: string;
            contractAddress: string | null;
            chain: string | null;
            createdAt: Date;
        }[];
    }>;
    addItem(userId: string, addWatchlistItemDto: AddWatchlistItemDto): Promise<{
        message: string;
        item: {
            id: string;
            createdAt: Date;
            chain: string | null;
            contractAddress: string | null;
            tokenSymbol: string;
            tokenName: string;
            watchlistId: string;
        };
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        message: string;
    }>;
    private findOrCreateDefaultWatchlist;
}
