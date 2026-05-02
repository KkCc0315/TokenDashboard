import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { WalletLookupDto } from './dto/wallet-lookup.dto';
import { WalletLookupResponse } from './wallet.types';
export declare class WalletProviderService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    private readonly apiKey;
    constructor(httpService: HttpService, configService: ConfigService);
    lookupWallet(dto: WalletLookupDto): Promise<WalletLookupResponse>;
    private mapHolding;
}
