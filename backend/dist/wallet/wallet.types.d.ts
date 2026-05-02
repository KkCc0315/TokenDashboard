export interface WalletHolding {
    tokenAddress: string | null;
    symbol: string;
    name: string;
    balance: string;
    usdValue: number | null;
}
export interface WalletLookupResponse {
    address: string;
    chain: string;
    totalTokens: number;
    holdings: WalletHolding[];
}
