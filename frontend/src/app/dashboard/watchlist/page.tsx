'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { formatApiError } from '@/lib/api';
import { shortenAddress } from '@/lib/format';
import { getWatchlist, removeWatchlistItem } from '@/services/watchlist';
import { Watchlist } from '@/types/watchlist';

function WatchlistContent() {
  const { notify } = useToast();
  const [watchlist, setWatchlist] = useState<Watchlist | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getWatchlist();
      setWatchlist(response);
    } catch (cause) {
      setError(formatApiError(cause));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleRemove = async (id: string, symbol: string) => {
    setRemovingId(id);
    try {
      await removeWatchlistItem(id);
      setWatchlist((current) =>
        current
          ? { ...current, items: current.items.filter((item) => item.id !== id) }
          : current,
      );
      notify(`${symbol} removed.`, 'info');
    } catch (cause) {
      notify(formatApiError(cause), 'error');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Container className="flex flex-col gap-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-text">Your watchlist</h1>
        <p className="text-sm text-text-muted">
          Tokens you have saved. Open any token from the explorer to add it here.
        </p>
      </header>

      {error && (
        <ErrorState
          message={error}
          action={
            <Button variant="secondary" size="sm" onClick={() => void load()}>
              Retry
            </Button>
          }
        />
      )}

      {isLoading && !watchlist && <ListSkeleton />}

      {!isLoading && !error && watchlist && watchlist.items.length === 0 && (
        <EmptyState
          title="No tokens saved yet"
          description="Browse the token explorer and tap “Add to watchlist” on any token detail page."
          action={
            <Link href="/tokens">
              <Button variant="primary">Browse tokens</Button>
            </Link>
          }
        />
      )}

      {watchlist && watchlist.items.length > 0 && (
        <ul className="flex flex-col gap-3">
          {watchlist.items.map((item) => (
            <li key={item.id}>
              <Card>
                <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/tokens/${encodeURIComponent(item.tokenSymbol)}`}
                      className="text-sm font-medium text-text hover:text-brand"
                    >
                      {item.tokenName}{' '}
                      <span className="text-text-muted">· {item.tokenSymbol}</span>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                      {item.chain && <Badge tone="brand">{item.chain}</Badge>}
                      {item.contractAddress && (
                        <span title={item.contractAddress}>
                          {shortenAddress(item.contractAddress)}
                        </span>
                      )}
                      <span>added {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={removingId === item.id}
                    onClick={() => handleRemove(item.id, item.tokenSymbol)}
                  >
                    Remove
                  </Button>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-full" />
      ))}
    </div>
  );
}

export default function WatchlistPage() {
  return (
    <ProtectedRoute>
      <WatchlistContent />
    </ProtectedRoute>
  );
}
