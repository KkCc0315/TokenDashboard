'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';

import { TokenChange } from '@/components/tokens/TokenChange';
import { TokenLogo } from '@/components/tokens/TokenLogo';
import { WatchlistToggle } from '@/components/tokens/WatchlistToggle';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ApiError, formatApiError } from '@/lib/api';
import { formatCompactUsd, formatPrice, shortenAddress } from '@/lib/format';
import { getTokenDetail } from '@/services/tokens';
import { TokenDetailResponse } from '@/types/token';

interface TokenDetailPageProps {
  params: Promise<{ symbol: string }>;
}

export default function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { symbol } = use(params);
  const [token, setToken] = useState<TokenDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    getTokenDetail(symbol)
      .then((response) => {
        if (!cancelled) setToken(response);
      })
      .catch((cause) => {
        if (cancelled) return;
        if (cause instanceof ApiError && cause.status === 404) {
          setNotFound(true);
        } else {
          setError(formatApiError(cause));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return (
    <Container className="flex flex-col gap-6 py-10">
      <Link
        href="/tokens"
        className="text-sm text-text-muted hover:text-text"
      >
        ← Back to tokens
      </Link>

      {isLoading && <DetailSkeleton />}

      {!isLoading && notFound && (
        <ErrorState
          title="Token not found"
          message={`We couldn't find a token matching "${symbol}". Try searching from the explorer.`}
          action={
            <Link
              href="/tokens"
              className="text-sm font-medium text-brand hover:text-brand-hover"
            >
              Back to explorer →
            </Link>
          }
        />
      )}

      {!isLoading && !notFound && error && <ErrorState message={error} />}

      {!isLoading && token && (
        <article className="flex flex-col gap-6">
          <header className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <TokenLogo src={token.imageUrl} symbol={token.symbol} size={48} />
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-text">
                  {token.name}{' '}
                  <span className="text-text-muted">· {token.symbol}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  {token.chain && <Badge tone="brand">{token.chain}</Badge>}
                  {token.contractAddress && (
                    <Badge tone="neutral" title={token.contractAddress}>
                      {shortenAddress(token.contractAddress)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <WatchlistToggle token={token} />
          </header>

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Price" value={formatPrice(token.price)} />
            <StatCard
              label="24h change"
              value={<TokenChange value={token.change24h} />}
            />
            <StatCard label="Market cap" value={formatCompactUsd(token.marketCap)} />
            <StatCard label="24h volume" value={formatCompactUsd(token.volume24h)} />
          </section>

          {token.description && (
            <Card>
              <CardBody className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                  About
                </h2>
                <p className="text-sm leading-relaxed text-text">{token.description}</p>
              </CardBody>
            </Card>
          )}

          {(token.homepage || token.explorer) && (
            <Card>
              <CardBody className="flex flex-wrap gap-4 text-sm">
                {token.homepage && (
                  <a
                    href={token.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand hover:text-brand-hover"
                  >
                    Homepage ↗
                  </a>
                )}
                {token.explorer && (
                  <a
                    href={token.explorer}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand hover:text-brand-hover"
                  >
                    Explorer ↗
                  </a>
                )}
              </CardBody>
            </Card>
          )}
        </article>
      )}
    </Container>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-text-muted">{label}</span>
        <span className="text-lg font-semibold tabular-nums text-text">{value}</span>
      </CardBody>
    </Card>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
