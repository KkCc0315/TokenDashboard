'use client';

import { TokenSortBy } from '@/types/token';

const OPTIONS: { value: TokenSortBy; label: string }[] = [
  { value: 'marketCap', label: 'Market cap' },
  { value: 'price', label: 'Price' },
  { value: 'change24h', label: '24h change' },
  { value: 'volume', label: 'Volume' },
];

interface SortControlProps {
  value: TokenSortBy;
  onChange: (value: TokenSortBy) => void;
}

export function SortControl({ value, onChange }: SortControlProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-text-muted">
      <span>Sort by</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TokenSortBy)}
        className="h-9 rounded-md border border-border bg-bg-subtle px-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
