import { request } from '@/lib/api';
import { WalletLookupRequest, WalletLookupResponse } from '@/types/wallet';

export function lookupWallet(payload: WalletLookupRequest) {
  return request<WalletLookupResponse>('/wallet/lookup', {
    method: 'POST',
    body: payload,
  });
}
