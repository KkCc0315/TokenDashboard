import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare const publicUserSelect: {
    id: true;
    email: true;
    role: true;
    createdAt: true;
    updatedAt: true;
};
export declare class UsersService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Prisma.Prisma__UserClient<{
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
