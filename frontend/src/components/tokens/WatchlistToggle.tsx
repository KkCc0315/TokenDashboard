'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { formatApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  addWatchlistItem,
  getWatchlist,
  removeWatchlistItem,
} from '@/services/watchlist';
import { TokenDetailResponse } from '@/types/token';

interface WatchlistToggleProps {
  token: TokenDetailResponse;
}

export function WatchlistToggle({ token }: WatchlistToggleProps) {
  const { isAuthenticated, isReady } = useAuth();
  const { notify } = useToast();
  const [itemId, setItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return;
    let cancelled = false;
    setIsLoading(true);
    getWatchlist()
      .then((watchlist) => {
        if (cancelled) return;
        const match = watchlist.items.find(
          (item) => item.tokenSymbol.toUpperCase() === token.symbol.toUpperCase(),
        );
        setItemId(match?.id ?? null);
      })
      .catch(() => {
        // Silently degrade — toggle just stays in "Add" state.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isReady, token.symbol]);

  if (!isReady) return null;

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(`/tokens/${token.symbol}`)}`}
        className="text-sm font-medium text-brand hover:text-brand-hover"
      >
        Sign in to add to watchlist →
      </Link>
    );
  }

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-text-muted">
        <Spinner size={14} /> Checking watchlist…
      </span>
    );
  }

  const isInList = Boolean(itemId);

  const handleClick = async () => {
    setIsMutating(true);
    try {
      if (isInList && itemId) {
        await removeWatchlistItem(itemId);
        setItemId(null);
        notify(`${token.symbol} removed from watchlist.`, 'info');
      } else {
        const response = await addWatchlistItem({
          tokenSymbol: token.symbol,
          tokenName: token.name,
          contractAddress: token.contractAddress ?? undefined,
          chain: token.chain ?? undefined,
        });
        setItemId(response.item.id);
        notify(`${token.symbol} added to watchlist.`, 'success');
      }
    } catch (error) {
      notify(formatApiError(error), 'error');
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <Button
      variant={isInList ? 'secondary' : 'primary'}
      onClick={handleClick}
      isLoading={isMutating}
    >
      {isInList ? 'Remove from watchlist' : 'Add to watchlist'}
    </Button>
  );
}
