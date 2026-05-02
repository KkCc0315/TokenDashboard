import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private readonly cacheService;
    private readonly prismaService;
    constructor(cacheService: CacheService, prismaService: PrismaService);
    clearCache(): Promise<{
        message: string;
        cleared: {
            tokenLists: number;
            tokenDetails: number;
            walletLookups: number;
            total: number;
        };
    }>;
}
