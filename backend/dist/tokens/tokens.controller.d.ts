import { ListTokensQueryDto } from './dto/list-tokens-query.dto';
import { TokensService } from './tokens.service';
export declare class TokensController {
    private readonly tokensService;
    constructor(tokensService: TokensService);
    getTokens(query: ListTokensQueryDto): Promise<{}>;
    getTokenDetail(symbol: string): Promise<{}>;
}
