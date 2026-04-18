import { IsOptional, IsString } from "class-validator";

export class TokenQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  chain?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
