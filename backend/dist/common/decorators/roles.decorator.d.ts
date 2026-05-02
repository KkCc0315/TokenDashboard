import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/user-role.enum';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => ReturnType<typeof SetMetadata>;
