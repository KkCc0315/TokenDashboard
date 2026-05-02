import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: "up" | "down";
            redis: "up" | "down";
        };
    }>;
}
