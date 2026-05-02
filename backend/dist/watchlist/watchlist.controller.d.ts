import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AddWatchlistItemDto } from './dto/add-watchlist-item.dto';
import { WatchlistService } from './watchlist.service';
export declare class WatchlistController {
    private readonly watchlistService;
    constructor(watchlistService: WatchlistService);
    getWatchlist(user: AuthenticatedUser): Promise<{
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
    addItem(user: AuthenticatedUser, addWatchlistItemDto: AddWatchlistItemDto): Promise<{
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
    removeItem(user: AuthenticatedUser, id: string): Promise<{
        message: string;
    }>;
}
