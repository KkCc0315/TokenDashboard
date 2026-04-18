import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdatePreferencesDto } from "./dto/update-preferences.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getProfile(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        preferences: true
      }
    });
  }

  async updateProfile(userId: string, payload: UpdateProfileDto) {
    const data = {
      ...(payload.name?.trim() ? { name: payload.name.trim() } : {}),
      ...(payload.email?.trim() ? { email: payload.email.toLowerCase().trim() } : {})
    };

    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          preferences: true
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException("That email address is already in use");
      }

      throw error;
    }
  }

  getPreferences(userId: string) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });
  }

  updatePreferences(userId: string, payload: UpdatePreferencesDto) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      update: payload,
      create: {
        userId,
        ...payload
      }
    });
  }
}
