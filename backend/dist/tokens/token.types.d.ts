export interface TokenListItem {
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
    chain: string | null;
    imageUrl: string | null;
}
export interface TokenListResponse {
    items: TokenListItem[];
    meta: {
        page: number;
        limit: number;
        count: number;
        sortBy: string;
        search: string | null;
    };
}
export interface TokenDetailResponse {
    id: string;
    name: string;
    symbol: string;
    price: number | null;
    marketCap: number | null;
    volume24h: number | null;
    change24h: number | null;
    contractAddress: string | null;
    chain: string | null;
    description: string | null;
    homepage: string | null;
    explorer: string | null;
    imageUrl: string | null;
}
