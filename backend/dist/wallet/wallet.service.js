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
var WalletService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../cache/cache.service");
const prisma_service_1 = require("../prisma/prisma.service");
const wallet_provider_service_1 = require("./wallet-provider.service");
let WalletService = WalletService_1 = class WalletService {
    constructor(cacheService, prismaService, walletProviderService) {
        this.cacheService = cacheService;
        this.prismaService = prismaService;
        this.walletProviderService = walletProviderService;
        this.logger = new common_1.Logger(WalletService_1.name);
    }
    async lookupWallet(dto) {
        const key = `wallet:lookup:${dto.chain}:${dto.address.toLowerCase()}`;
        const cached = await this.cacheService.get(key);
        if (cached) {
            return cached;
        }
        try {
            const response = await this.walletProviderService.lookupWallet(dto);
            await this.cacheService.set(key, response, 120);
            return response;
        }
        catch (error) {
            await this.logProviderFailure(dto.address, error);
            throw error;
        }
    }
    async logProviderFailure(address, error) {
        const message = error instanceof Error ? error.message : 'Unknown wallet provider error';
        this.logger.error(`Wallet provider failure on ${address}: ${message}`);
        try {
            await this.prismaService.apiSyncLog.create({
                data: {
                    provider: 'wallet-provider',
                    endpoint: `/wallet/lookup/${address}`,
                    status: 'ERROR',
                    message,
                },
            });
        }
        catch (loggingError) {
            const details = loggingError instanceof Error ? loggingError.message : 'Unknown logging error';
            this.logger.warn(`Unable to persist wallet sync log: ${details}`);
        }
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = WalletService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        prisma_service_1.PrismaService,
        wallet_provider_service_1.WalletProviderService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map