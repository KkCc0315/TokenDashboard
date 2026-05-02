import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';
import { ListTokensQueryDto } from './dto/list-tokens-query.dto';
import { TokenProviderService } from './token-provider.service';
export declare class TokensService {
    private readonly cacheService;
    private readonly prismaService;
    private readonly tokenProviderService;
    private readonly logger;
    constructor(cacheService: CacheService, prismaService: PrismaService, tokenProviderService: TokenProviderService);
    getTokens(query: ListTokensQueryDto): Promise<{}>;
    getTokenDetail(symbol: string): Promise<{}>;
    private logProviderFailure;
}
