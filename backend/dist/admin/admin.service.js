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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../cache/cache.service");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(cacheService, prismaService) {
        this.cacheService = cacheService;
        this.prismaService = prismaService;
    }
    async clearCache() {
        const [tokenLists, tokenDetails, walletLookups] = await Promise.all([
            this.cacheService.clearByPrefix('tokens:list:'),
            this.cacheService.clearByPrefix('token:detail:'),
            this.cacheService.clearByPrefix('wallet:lookup:'),
        ]);
        const totalCleared = tokenLists + tokenDetails + walletLookups;
        await this.prismaService.apiSyncLog.create({
            data: {
                provider: 'admin',
                endpoint: '/admin/cache/clear',
                status: 'SUCCESS',
                message: `Cleared ${totalCleared} cache entries`,
            },
        });
        return {
            message: 'Cache cleared successfully.',
            cleared: {
                tokenLists,
                tokenDetails,
                walletLookups,
                total: totalCleared,
            },
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map