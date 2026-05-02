export interface WatchlistItem {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  contractAddress: string | null;
  chain: string | null;
  createdAt: string;
}

export interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
}

export interface AddWatchlistItemRequest {
  tokenSymbol: string;
  tokenName: string;
  contractAddress?: string;
  chain?: string;
}

export interface AddWatchlistItemResponse {
  message: string;
  item: WatchlistItem;
}
