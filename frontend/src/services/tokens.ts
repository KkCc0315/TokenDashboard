import { request } from '@/lib/api';
import {
  ListTokensQuery,
  TokenDetailResponse,
  TokenListResponse,
} from '@/types/token';

export function listTokens(query: ListTokensQuery = {}) {
  return request<TokenListResponse>('/tokens', {
    query: {
      page: query.page,
      limit: query.limit,
      search: query.search,
      sortBy: query.sortBy,
    },
  });
}

export function getTokenDetail(symbol: string) {
  return request<TokenDetailResponse>(`/tokens/${encodeURIComponent(symbol)}`);
}
