import Link from 'next/link';

import { Skeleton } from '@/components/ui/Skeleton';
import { formatCompactUsd, formatPrice } from '@/lib/format';
import { TokenListItem } from '@/types/token';

import { TokenChange } from './TokenChange';
import { TokenLogo } from './TokenLogo';

interface TokenTableProps {
  items: TokenListItem[];
  pageOffset?: number;
}

export function TokenTable({ items, pageOffset = 0 }: TokenTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-panel">
      <div className="hidden grid-cols-[40px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-4 border-b border-border-subtle bg-bg-subtle px-5 py-3 text-xs font-medium uppercase tracking-wide text-text-muted md:grid">
        <span>#</span>
        <span>Token</span>
        <span className="text-right">Price</span>
        <span className="text-right">24h</span>
        <span className="text-right">Market cap</span>
        <span className="text-right">Volume</span>
      </div>
      <ul className="divide-y divide-border-subtle">
        {items.map((token, index) => (
          <li key={`${token.symbol}-${index}`}>
            <Link
              href={`/tokens/${encodeURIComponent(token.symbol)}`}
              className="grid grid-cols-1 gap-2 px-5 py-3 transition-colors hover:bg-bg-subtle md:grid-cols-[40px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-4"
            >
              <span className="hidden text-sm text-text-muted md:inline">
                {pageOffset + index + 1}
              </span>
              <div className="flex items-center gap-3">
                <TokenLogo src={token.imageUrl} symbol={token.symbol} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text">{token.name}</span>
                  <span className="text-xs uppercase text-text-muted">{token.symbol}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm md:contents">
                <span className="text-right tabular-nums">
                  <span className="md:hidden text-xs uppercase text-text-muted block">Price</span>
                  {formatPrice(token.price)}
                </span>
                <span className="text-right">
                  <span className="md:hidden text-xs uppercase text-text-muted block">24h</span>
                  <TokenChange value={token.change24h} />
                </span>
                <span className="text-right tabular-nums text-text-muted">
                  <span className="md:hidden text-xs uppercase block">Market cap</span>
                  {formatCompactUsd(token.marketCap)}
                </span>
                <span className="text-right tabular-nums text-text-muted">
                  <span className="md:hidden text-xs uppercase block">Volume</span>
                  {formatCompactUsd(token.volume24h)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TokenTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-bg-panel">
      <div className="border-b border-border-subtle bg-bg-subtle px-5 py-3">
        <Skeleton className="h-3 w-24" />
      </div>
      <ul className="divide-y divide-border-subtle">
        {Array.from({ length: rows }).map((_, index) => (
          <li
            key={index}
            className="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-3 w-16" />
          </li>
        ))}
      </ul>
    </div>
  );
}
