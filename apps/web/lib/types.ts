export type Token = {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  category: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: string;
  holders: string;
  description: string;
};

export type AlertCondition = "ABOVE" | "BELOW";
export type AlertState = "ARMED" | "TRIGGERED";

export type WatchlistItem = {
  id?: string;
  tokenId: string;
  note: string;
  targetPrice: number;
  alertCondition?: AlertCondition;
  alertState?: AlertState;
  currentPrice?: number | null;
  lastTriggeredAt?: string | null;
  lastTriggeredPrice?: number | null;
  createdAt?: string;
};

export type WalletHolding = {
  tokenId: string;
  balance: string;
  valueUsd: number;
};

export type WalletSummary = {
  address: string;
  totalValue: number;
  realizedPnl: number;
  tokens: WalletHolding[];
};

export type MarketSnapshot = {
  updatedAt: string;
  cacheStatus: "warm" | "refreshing";
  dominance: string;
  fearGreed: number;
  trending: string[];
};

export type UserPreference = {
  theme: string;
  defaultChain: string;
  compactNumbers: boolean;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreference | null;
};

export type DashboardData = {
  tokens: Token[];
  watchlist: WatchlistItem[];
  wallets: WalletSummary[];
  market: MarketSnapshot;
  dataSource: "api" | "fallback";
};
