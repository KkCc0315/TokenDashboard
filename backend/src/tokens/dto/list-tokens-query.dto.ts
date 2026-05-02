import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

const tokenSortOptions = ['marketCap', 'price', 'change24h', 'volume'] as const;

export class ListTokensQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsIn(tokenSortOptions)
  sortBy: (typeof tokenSortOptions)[number] = 'marketCap';
}
