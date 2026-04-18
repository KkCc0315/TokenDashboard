import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { AlertCondition, AlertState, Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { MarketDataService } from "../market/market-data.service";
import { CreateWatchlistItemDto } from "./dto/create-watchlist-item.dto";

@Injectable()
export class WatchlistService {
  private readonly logger = new Logger(WatchlistService.name);
  private hasLoggedEvaluationFailure = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly marketDataService: MarketDataService
  ) {}

  async findAll(userId: string) {
    const [items, tokens] = await Promise.all([
      this.prisma.watchlistItem.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      }),
      this.marketDataService.getTokens()
    ]);
    const priceByTokenId = new Map<string, number>(tokens.map((token) => [token.id, token.price]));

    return items.map((item) => ({
      ...item,
      currentPrice: priceByTokenId.get(item.tokenId) ?? null
    }));
  }

  findAlerts(userId: string) {
    return this.prisma.alertEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 25
    });
  }

  create(userId: string, payload: CreateWatchlistItemDto) {
    const alertCondition = payload.alertCondition ?? AlertCondition.ABOVE;

    return this.prisma.watchlistItem.upsert({
      where: {
        userId_tokenId: {
          userId,
          tokenId: payload.tokenId
        }
      },
      update: {
        note: payload.note,
        targetPrice: payload.targetPrice,
        alertCondition,
        alertState: AlertState.ARMED,
        lastTriggeredAt: null,
        lastTriggeredPrice: null
      },
      create: {
        userId,
        tokenId: payload.tokenId,
        note: payload.note,
        targetPrice: payload.targetPrice,
        alertCondition,
        alertState: AlertState.ARMED
      }
    });
  }

  async remove(userId: string, tokenId: string) {
    try {
      return await this.prisma.watchlistItem.delete({
        where: {
          userId_tokenId: {
            userId,
            tokenId
          }
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundException(`Watchlist token ${tokenId} was not found`);
      }

      throw error;
    }
  }

  async evaluateAlerts() {
    try {
      const [items, tokens] = await Promise.all([
        this.prisma.watchlistItem.findMany(),
        this.marketDataService.getTokens()
      ]);
      const priceByTokenId = new Map<string, number>(tokens.map((token) => [token.id, token.price]));
      const operations: Prisma.PrismaPromise<unknown>[] = [];
      let triggeredCount = 0;

      for (const item of items) {
        const currentPrice = priceByTokenId.get(item.tokenId);

        if (typeof currentPrice !== "number") {
          continue;
        }

        const isTriggered =
          item.alertCondition === AlertCondition.BELOW
            ? currentPrice <= item.targetPrice
            : currentPrice >= item.targetPrice;

        if (isTriggered && item.alertState !== AlertState.TRIGGERED) {
          triggeredCount += 1;
          operations.push(
            this.prisma.alertEvent.create({
              data: {
                watchlistItemId: item.id,
                userId: item.userId,
                tokenId: item.tokenId,
                targetPrice: item.targetPrice,
                observedPrice: currentPrice,
                alertCondition: item.alertCondition
              }
            })
          );
          operations.push(
            this.prisma.watchlistItem.update({
              where: { id: item.id },
              data: {
                alertState: AlertState.TRIGGERED,
                lastEvaluatedPrice: currentPrice,
                lastTriggeredPrice: currentPrice,
                lastTriggeredAt: new Date()
              }
            })
          );
          continue;
        }

        operations.push(
          this.prisma.watchlistItem.update({
            where: { id: item.id },
            data: {
              alertState: isTriggered ? AlertState.TRIGGERED : AlertState.ARMED,
              lastEvaluatedPrice: currentPrice
            }
          })
        );
      }

      if (operations.length > 0) {
        await this.prisma.$transaction(operations);
      }

      return triggeredCount;
    } catch (error) {
      if (!this.hasLoggedEvaluationFailure) {
        this.logger.warn("Alert evaluation failed. Skipping this cycle.");
        this.hasLoggedEvaluationFailure = true;
      }
      this.logger.debug(String(error));
      return 0;
    }
  }
}
