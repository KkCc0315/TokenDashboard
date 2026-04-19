import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CacheService } from "../cache/cache.service";
import { PrismaService } from "../database/prisma.service";
import type { AuthTokenPayload, AuthenticatedUser } from "./authenticated-user.interface";

type RequestWithHeaders = {
  headers: {
    authorization?: string;
  };
  user?: AuthenticatedUser;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly cache: CacheService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const payload = await this.jwtService.verifyAsync<AuthTokenPayload>(token);

    const cacheKey = `user:${payload.sub}`;
    let user = this.cache.get<AuthenticatedUser>(cacheKey);

    if (!user) {
      user =
        (await this.prisma.user.findUnique({
          where: { id: payload.sub },
          select: { id: true, email: true, name: true }
        })) ?? undefined;

      if (user) {
        this.cache.set(cacheKey, user, 60);
      }
    }

    if (!user) {
      throw new UnauthorizedException("User no longer exists");
    }

    request.user = user;
    return true;
  }
}
