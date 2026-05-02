import { request } from '@/lib/api';
import {
  AddWatchlistItemRequest,
  AddWatchlistItemResponse,
  Watchlist,
} from '@/types/watchlist';

export function getWatchlist() {
  return request<Watchlist>('/watchlist', { auth: true });
}

export function addWatchlistItem(payload: AddWatchlistItemRequest) {
  return request<AddWatchlistItemResponse>('/watchlist', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export function removeWatchlistItem(id: string) {
  return request<{ message: string }>(`/watchlist/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: true,
  });
}
