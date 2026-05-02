import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';
import { WalletLookupDto } from './dto/wallet-lookup.dto';
import { WalletProviderService } from './wallet-provider.service';
export declare class WalletService {
    private readonly cacheService;
    private readonly prismaService;
    private readonly walletProviderService;
    private readonly logger;
    constructor(cacheService: CacheService, prismaService: PrismaService, walletProviderService: WalletProviderService);
    lookupWallet(dto: WalletLookupDto): Promise<{}>;
    private logProviderFailure;
}
