import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdatePreferencesDto {
  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  defaultChain?: string;

  @IsOptional()
  @IsBoolean()
  compactNumbers?: boolean;
}
