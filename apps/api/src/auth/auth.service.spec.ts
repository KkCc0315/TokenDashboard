import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Prisma } from "@prisma/client";
import { AuthService } from "./auth.service";
import { PrismaService } from "../database/prisma.service";
import * as passwordUtils from "./password";

jest.mock("./password");

describe("AuthService", () => {
  let service: AuthService;
  let prisma: { user: { create: jest.Mock; findUnique: jest.Mock; findUniqueOrThrow: jest.Mock } };
  let jwt: { signAsync: jest.Mock };

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findUniqueOrThrow: jest.fn()
      }
    };
    jwt = { signAsync: jest.fn().mockResolvedValue("test-token") };
    service = new AuthService(jwt as unknown as JwtService, prisma as unknown as PrismaService);
  });

  describe("register", () => {
    it("creates a user and returns an access token", async () => {
      (passwordUtils.hashPassword as jest.Mock).mockResolvedValue("hashed");
      prisma.user.create.mockResolvedValue({ id: "1", email: "a@b.com", name: "Test" });

      const result = await service.register({ email: "a@b.com", password: "password123", name: "Test" });

      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: "test-token", user: { id: "1", email: "a@b.com", name: "Test" } });
    });

    it("throws BadRequestException on duplicate email", async () => {
      (passwordUtils.hashPassword as jest.Mock).mockResolvedValue("hashed");
      const prismaError = new Prisma.PrismaClientKnownRequestError("Unique constraint", {
        code: "P2002",
        clientVersion: "6.0.0"
      });
      prisma.user.create.mockRejectedValue(prismaError);

      await expect(service.register({ email: "a@b.com", password: "password123", name: "Test" })).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("login", () => {
    it("returns token for valid credentials", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "1",
        email: "a@b.com",
        name: "Test",
        passwordHash: "hashed"
      });
      (passwordUtils.verifyPassword as jest.Mock).mockResolvedValue(true);

      const result = await service.login({ email: "a@b.com", password: "password123" });

      expect(result).toEqual({ accessToken: "test-token", user: { id: "1", email: "a@b.com", name: "Test" } });
    });

    it("throws UnauthorizedException for wrong password", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "1",
        email: "a@b.com",
        name: "Test",
        passwordHash: "hashed"
      });
      (passwordUtils.verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: "a@b.com", password: "wrong" })).rejects.toThrow(UnauthorizedException);
    });

    it("throws UnauthorizedException for unknown email", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ email: "no@user.com", password: "pass1234" })).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe("getAuthenticatedUser", () => {
    it("returns user data", async () => {
      const user = { id: "1", email: "a@b.com", name: "Test", preferences: null };
      prisma.user.findUniqueOrThrow.mockResolvedValue(user);

      const result = await service.getAuthenticatedUser("1");

      expect(result).toEqual(user);
    });
  });

  describe("refreshToken", () => {
    it("returns a new access token", async () => {
      const result = await service.refreshToken("1", "a@b.com");

      expect(jwt.signAsync).toHaveBeenCalledWith({ sub: "1", email: "a@b.com" });
      expect(result).toEqual({ accessToken: "test-token" });
    });
  });
});
