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
exports.WalletProviderService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let WalletProviderService = class WalletProviderService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get('WALLET_PROVIDER_BASE_URL', 'https://deep-index.moralis.io/api/v2.2');
        this.apiKey = this.configService.get('WALLET_PROVIDER_API_KEY') || undefined;
    }
    async lookupWallet(dto) {
        if (!this.apiKey) {
            throw new common_1.ServiceUnavailableException('Wallet provider is not configured. Supply provider credentials in the environment.');
        }
        const { data } = await this.httpService.axiosRef.get(`${this.baseUrl}/wallets/${dto.address}/tokens`, {
            timeout: 5_000,
            params: {
                chain: dto.chain,
            },
            headers: {
                'X-API-Key': this.apiKey,
            },
        });
        const rawHoldings = Array.isArray(data)
            ? data
            : Array.isArray(data.result)
                ? data.result
                : [];
        const holdings = rawHoldings.map((holding) => this.mapHolding(holding));
        return {
            address: dto.address,
            chain: dto.chain,
            totalTokens: holdings.length,
            holdings,
        };
    }
    mapHolding(holding) {
        return {
            tokenAddress: typeof holding.token_address === 'string' ? holding.token_address : null,
            symbol: typeof holding.symbol === 'string' ? holding.symbol : 'UNKNOWN',
            name: typeof holding.name === 'string' ? holding.name : 'Unknown token',
            balance: typeof holding.balance_formatted === 'string'
                ? holding.balance_formatted
                : typeof holding.balance === 'string'
                    ? holding.balance
                    : '0',
            usdValue: typeof holding.usd_value === 'number'
                ? holding.usd_value
                : typeof holding.usd_value_24hr_usd_change === 'number'
                    ? holding.usd_value_24hr_usd_change
                    : null,
        };
    }
};
exports.WalletProviderService = WalletProviderService;
exports.WalletProviderService = WalletProviderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], WalletProviderService);
//# sourceMappingURL=wallet-provider.service.js.map