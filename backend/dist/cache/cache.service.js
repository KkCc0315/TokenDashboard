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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let CacheService = CacheService_1 = class CacheService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(CacheService_1.name);
        this.client = new ioredis_1.default({
            host: this.configService.get('REDIS_HOST', '127.0.0.1'),
            port: this.configService.get('REDIS_PORT', 6379),
            password: this.configService.get('REDIS_PASSWORD') || undefined,
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            enableReadyCheck: true,
        });
    }
    async ensureConnection() {
        if (this.client.status === 'wait') {
            await this.client.connect();
        }
    }
    async get(key) {
        await this.ensureConnection();
        const raw = await this.client.get(key);
        return raw ? JSON.parse(raw) : null;
    }
    async set(key, value, ttlSeconds) {
        await this.ensureConnection();
        await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }
    async del(key) {
        await this.ensureConnection();
        await this.client.del(key);
    }
    async clearByPrefix(prefix) {
        await this.ensureConnection();
        const keys = await this.client.keys(`${prefix}*`);
        if (keys.length === 0) {
            return 0;
        }
        const deleted = await this.client.del(...keys);
        this.logger.log(`Cleared ${deleted} cache entr${deleted === 1 ? 'y' : 'ies'} for ${prefix}`);
        return deleted;
    }
    async ping() {
        try {
            await this.ensureConnection();
            const result = await this.client.ping();
            return result === 'PONG' ? 'up' : 'down';
        }
        catch {
            return 'down';
        }
    }
    async onModuleDestroy() {
        if (this.client.status !== 'end') {
            await this.client.quit();
        }
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CacheService);
//# sourceMappingURL=cache.service.js.map