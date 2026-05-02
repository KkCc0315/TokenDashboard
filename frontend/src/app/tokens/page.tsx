'use client';

import { useEffect, useState } from 'react';

import { Pagination } from '@/components/tokens/Pagination';
import { SortControl } from '@/components/tokens/SortControl';
import { TokenTable, TokenTableSkeleton } from '@/components/tokens/TokenTable';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { formatApiError } from '@/lib/api';
import { listTokens } from '@/services/tokens';
import { TokenListResponse, TokenSortBy } from '@/types/token';

const PAGE_SIZE = 20;

export default function TokensPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<TokenSortBy>('marketCap');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TokenListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(search, 350);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    listTokens({ page, limit: PAGE_SIZE, search: debouncedSearch, sortBy })
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch((cause) => {
        if (!cancelled) setError(formatApiError(cause));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, sortBy]);

  const items = data?.items ?? [];
  const hasNext = items.length === PAGE_SIZE;

  return (
    <Container className="flex flex-col gap-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-text">Token explorer</h1>
        <p className="text-sm text-text-muted">
          Live token market data from your aggregator. Search by name or symbol, sort by
          your preferred metric.
        </p>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="md:w-80">
          <Input
            label="Search"
            name="search"
            placeholder="e.g. ethereum, btc"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <SortControl value={sortBy} onChange={setSortBy} />
      </div>

      {error ? (
        <ErrorState
          message={error}
          action={
            <Button variant="secondary" size="sm" onClick={() => setPage((current) => current)}>
              Retry
            </Button>
          }
        />
      ) : isLoading && !data ? (
        <TokenTableSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          title="No tokens match"
          description={
            debouncedSearch
              ? `Nothing matched "${debouncedSearch}". Try a different name or symbol.`
              : 'The provider returned no tokens.'
          }
        />
      ) : (
        <>
          <TokenTable items={items} pageOffset={(page - 1) * PAGE_SIZE} />
          <Pagination
            page={page}
            hasNext={hasNext}
            onChange={setPage}
            isLoading={isLoading}
          />
        </>
      )}
    </Container>
  );
}
