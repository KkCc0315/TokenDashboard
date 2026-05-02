import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ListTokensQueryDto } from './dto/list-tokens-query.dto';
import { TokenDetailResponse, TokenListResponse } from './token.types';
export declare class TokenProviderService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    fetchTokens(query: ListTokensQueryDto): Promise<TokenListResponse>;
    fetchTokenDetail(symbol: string): Promise<TokenDetailResponse>;
    private mapListItem;
    private mapSort;
    private sortItems;
}
