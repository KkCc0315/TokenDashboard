import { BadRequestException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { UsersService } from "./users.service";
import { PrismaService } from "../database/prisma.service";

describe("UsersService", () => {
  let service: UsersService;
  let prisma: {
    user: { findUniqueOrThrow: jest.Mock; update: jest.Mock };
    userPreference: { upsert: jest.Mock };
  };

  beforeEach(() => {
    prisma = {
      user: {
        findUniqueOrThrow: jest.fn(),
        update: jest.fn()
      },
      userPreference: {
        upsert: jest.fn()
      }
    };
    service = new UsersService(prisma as unknown as PrismaService);
  });

  describe("getProfile", () => {
    it("returns user profile", async () => {
      const user = { id: "1", email: "a@b.com", name: "Test", preferences: null };
      prisma.user.findUniqueOrThrow.mockResolvedValue(user);

      const result = await service.getProfile("1");
      expect(result).toEqual(user);
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "1" } }));
    });
  });

  describe("updateProfile", () => {
    it("updates name and email", async () => {
      const updated = { id: "1", email: "new@b.com", name: "New", preferences: null };
      prisma.user.update.mockResolvedValue(updated);

      const result = await service.updateProfile("1", { name: "New", email: "new@b.com" });
      expect(result).toEqual(updated);
    });

    it("throws BadRequestException on duplicate email", async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError("Unique constraint", {
        code: "P2002",
        clientVersion: "6.0.0"
      });
      prisma.user.update.mockRejectedValue(prismaError);

      await expect(service.updateProfile("1", { email: "taken@b.com" })).rejects.toThrow(BadRequestException);
    });
  });

  describe("getPreferences", () => {
    it("upserts and returns preferences", async () => {
      const prefs = { theme: "system", defaultChain: "All", compactNumbers: true };
      prisma.userPreference.upsert.mockResolvedValue(prefs);

      const result = await service.getPreferences("1");
      expect(result).toEqual(prefs);
    });
  });

  describe("updatePreferences", () => {
    it("updates preferences", async () => {
      const prefs = { theme: "dark", defaultChain: "Ethereum", compactNumbers: false };
      prisma.userPreference.upsert.mockResolvedValue(prefs);

      const result = await service.updatePreferences("1", prefs);
      expect(result).toEqual(prefs);
    });
  });
});
