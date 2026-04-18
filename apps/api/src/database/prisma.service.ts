import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      return;
    }

    try {
      await this.$connect();
    } catch (error) {
      this.logger.warn(
        "Database connection unavailable. Persistence-backed user features will fail until DATABASE_URL is fixed."
      );
      this.logger.debug(String(error));
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
