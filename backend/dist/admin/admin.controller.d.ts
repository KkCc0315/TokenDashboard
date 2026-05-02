import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    clearCache(): Promise<{
        message: string;
        cleared: {
            tokenLists: number;
            tokenDetails: number;
            walletLookups: number;
            total: number;
        };
    }>;
}
