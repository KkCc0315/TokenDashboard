import { BadRequestException, Injectable, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../database/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { hashPassword, verifyPassword } from "./password";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async register(payload: RegisterDto) {
    const passwordHash = await hashPassword(payload.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: payload.email.toLowerCase(),
          name: payload.name.trim(),
          passwordHash,
          preferences: {
            create: {}
          }
        },
        select: {
          id: true,
          email: true,
          name: true
        }
      });

      return this.createAuthResponse(user);
    } catch (error) {
      this.rethrowDatabaseUnavailable(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException("An account with that email already exists");
      }

      throw error;
    }
  }

  async login(payload: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: payload.email.toLowerCase() }
      });

      if (!user || !(await verifyPassword(payload.password, user.passwordHash))) {
        throw new UnauthorizedException("Invalid email or password");
      }

      return this.createAuthResponse({
        id: user.id,
        email: user.email,
        name: user.name
      });
    } catch (error) {
      this.rethrowDatabaseUnavailable(error);
      throw error;
    }
  }

  async getAuthenticatedUser(userId: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          preferences: true
        }
      });
    } catch (error) {
      this.rethrowDatabaseUnavailable(error);
      throw error;
    }
  }

  async refreshToken(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      email
    });
    return { accessToken };
  }

  private async createAuthResponse(user: { id: string; email: string; name: string }) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email
    });

    return {
      accessToken,
      user
    };
  }

  private rethrowDatabaseUnavailable(error: unknown) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new ServiceUnavailableException("Database unavailable. Start the SSH tunnel and try again.");
    }
  }
}
