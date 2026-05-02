import { WalletLookupDto } from './dto/wallet-lookup.dto';
import { WalletService } from './wallet.service';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    lookup(walletLookupDto: WalletLookupDto): Promise<{}>;
}
