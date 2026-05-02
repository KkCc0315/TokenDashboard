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
var TokensService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensService = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../cache/cache.service");
const prisma_service_1 = require("../prisma/prisma.service");
const token_provider_service_1 = require("./token-provider.service");
let TokensService = TokensService_1 = class TokensService {
    constructor(cacheService, prismaService, tokenProviderService) {
        this.cacheService = cacheService;
        this.prismaService = prismaService;
        this.tokenProviderService = tokenProviderService;
        this.logger = new common_1.Logger(TokensService_1.name);
    }
    async getTokens(query) {
        const key = `tokens:list:${JSON.stringify({
            page: query.page,
            limit: query.limit,
            search: query.search?.trim().toLowerCase() ?? '',
            sortBy: query.sortBy,
        })}`;
        const cached = await this.cacheService.get(key);
        if (cached) {
            return cached;
        }
        try {
            const response = await this.tokenProviderService.fetchTokens(query);
            await this.cacheService.set(key, response, 60);
            return response;
        }
        catch (error) {
            await this.logProviderFailure('/coins/markets', error);
            throw error;
        }
    }
    async getTokenDetail(symbol) {
        const key = `token:detail:${symbol.trim().toUpperCase()}`;
        const cached = await this.cacheService.get(key);
        if (cached) {
            return cached;
        }
        try {
            const response = await this.tokenProviderService.fetchTokenDetail(symbol);
            await this.cacheService.set(key, response, 120);
            return response;
        }
        catch (error) {
            await this.logProviderFailure(`/coins/${symbol}`, error);
            throw error;
        }
    }
    async logProviderFailure(endpoint, error) {
        const message = error instanceof Error ? error.message : 'Unknown token provider error';
        this.logger.error(`Token provider failure on ${endpoint}: ${message}`);
        try {
            await this.prismaService.apiSyncLog.create({
                data: {
                    provider: 'token-provider',
                    endpoint,
                    status: 'ERROR',
                    message,
                },
            });
        }
        catch (loggingError) {
            const details = loggingError instanceof Error ? loggingError.message : 'Unknown logging error';
            this.logger.warn(`Unable to persist token sync log: ${details}`);
        }
    }
};
exports.TokensService = TokensService;
exports.TokensService = TokensService = TokensService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        prisma_service_1.PrismaService,
        token_provider_service_1.TokenProviderService])
], TokensService);
//# sourceMappingURL=tokens.service.js.map