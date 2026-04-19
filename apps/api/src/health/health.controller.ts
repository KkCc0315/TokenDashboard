import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    let database = "ok";

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = "unavailable";
    }

    return {
      status: database === "ok" ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      database
    };
  }
}
