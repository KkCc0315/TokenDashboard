import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AddWatchlistItemDto {
  @IsString()
  @MaxLength(20)
  tokenSymbol!: string;

  @IsString()
  @MaxLength(100)
  tokenName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  contractAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  chain?: string;
}
