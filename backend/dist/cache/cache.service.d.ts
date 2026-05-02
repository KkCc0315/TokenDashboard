import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class CacheService implements OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private readonly client;
    constructor(configService: ConfigService);
    private ensureConnection;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: unknown, ttlSeconds: number): Promise<void>;
    del(key: string): Promise<void>;
    clearByPrefix(prefix: string): Promise<number>;
    ping(): Promise<'up' | 'down'>;
    onModuleDestroy(): Promise<void>;
}
