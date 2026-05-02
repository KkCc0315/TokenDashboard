import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class HealthService {
    private readonly prismaService;
    private readonly cacheService;
    constructor(prismaService: PrismaService, cacheService: CacheService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: "up" | "down";
            redis: "up" | "down";
        };
    }>;
    private checkDatabase;
}
