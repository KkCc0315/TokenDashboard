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
exports.TokenProviderService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
let TokenProviderService = class TokenProviderService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get('TOKEN_PROVIDER_BASE_URL', 'https://api.coingecko.com/api/v3');
    }
    async fetchTokens(query) {
        const { data } = await this.httpService.axiosRef.get(`${this.baseUrl}/coins/markets`, {
            timeout: 5_000,
            params: {
                vs_currency: 'usd',
                order: this.mapSort(query.sortBy),
                page: query.page,
                per_page: query.limit,
                sparkline: false,
                price_change_percentage: '24h',
            },
        });
        let items = data.map((token) => this.mapListItem(token));
        if (query.search) {
            const search = query.search.trim().toLowerCase();
            items = items.filter((token) => token.name.toLowerCase().includes(search) ||
                token.symbol.toLowerCase().includes(search));
        }
        items = this.sortItems(items, query.sortBy);
        return {
            items,
            meta: {
                page: query.page,
                limit: query.limit,
                count: items.length,
                sortBy: query.sortBy,
                search: query.search?.trim() || null,
            },
        };
    }
    async fetchTokenDetail(symbol) {
        const normalizedSymbol = symbol.trim().toLowerCase();
        const searchResponse = await this.httpService.axiosRef.get(`${this.baseUrl}/search`, {
            timeout: 5_000,
            params: {
                query: normalizedSymbol,
            },
        });
        const coins = searchResponse.data.coins ?? [];
        const match = coins.find((coin) => coin.symbol.toLowerCase() === normalizedSymbol) ?? coins[0];
        if (!match) {
            throw new common_1.HttpException(`Token ${symbol} was not found.`, 404);
        }
        const { data } = await this.httpService.axiosRef.get(`${this.baseUrl}/coins/${match.id}`, {
            timeout: 5_000,
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
                sparkline: false,
            },
        });
        const platformEntries = Object.entries(data.platforms ?? {}).filter(([, address]) => Boolean(address));
        const [chain, contractAddress] = platformEntries[0] ?? [null, null];
        return {
            id: data.id,
            name: data.name,
            symbol: data.symbol.toUpperCase(),
            price: data.market_data?.current_price?.usd ?? null,
            marketCap: data.market_data?.market_cap?.usd ?? null,
            volume24h: data.market_data?.total_volume?.usd ?? null,
            change24h: data.market_data?.price_change_percentage_24h ?? null,
            contractAddress,
            chain,
            description: data.description?.en?.slice(0, 400) ?? null,
            homepage: data.links?.homepage?.find(Boolean) ?? null,
            explorer: data.links?.blockchain_site?.find(Boolean) ?? null,
            imageUrl: data.image?.large ?? null,
        };
    }
    mapListItem(token) {
        return {
            name: token.name,
            symbol: token.symbol.toUpperCase(),
            price: token.current_price,
            change24h: token.price_change_percentage_24h ?? 0,
            marketCap: token.market_cap,
            volume24h: token.total_volume,
            chain: null,
            imageUrl: token.image,
        };
    }
    mapSort(sortBy) {
        switch (sortBy) {
            case 'price':
                return 'market_cap_desc';
            case 'change24h':
                return 'market_cap_desc';
            case 'volume':
                return 'volume_desc';
            case 'marketCap':
            default:
                return 'market_cap_desc';
        }
    }
    sortItems(items, sortBy) {
        const sorted = [...items];
        sorted.sort((left, right) => {
            switch (sortBy) {
                case 'price':
                    return right.price - left.price;
                case 'change24h':
                    return right.change24h - left.change24h;
                case 'volume':
                    return right.volume24h - left.volume24h;
                case 'marketCap':
                default:
                    return right.marketCap - left.marketCap;
            }
        });
        return sorted;
    }
};
exports.TokenProviderService = TokenProviderService;
exports.TokenProviderService = TokenProviderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], TokenProviderService);
//# sourceMappingURL=token-provider.service.js.map