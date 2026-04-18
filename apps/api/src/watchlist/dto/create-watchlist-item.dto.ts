import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { AlertCondition } from "@prisma/client";

export class CreateWatchlistItemDto {
  @IsString()
  tokenId!: string;

  @IsString()
  note!: string;

  @Type(() => Number)
  @IsNumber()
  targetPrice!: number;

  @IsOptional()
  @IsEnum(AlertCondition)
  alertCondition?: AlertCondition;
}
