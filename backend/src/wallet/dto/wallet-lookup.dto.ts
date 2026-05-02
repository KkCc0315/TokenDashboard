import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class WalletLookupDto {
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Wallet address must be a valid EVM address.',
  })
  address!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  chain = 'eth';
}
