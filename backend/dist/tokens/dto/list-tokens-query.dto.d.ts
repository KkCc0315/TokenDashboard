import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
declare const tokenSortOptions: readonly ["marketCap", "price", "change24h", "volume"];
export declare class ListTokensQueryDto extends PaginationQueryDto {
    search?: string;
    sortBy: (typeof tokenSortOptions)[number];
}
export {};
