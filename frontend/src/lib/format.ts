const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const microPriceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  if (value !== 0 && Math.abs(value) < 1) return microPriceFormatter.format(value);
  return priceFormatter.format(value);
}

export function formatCompactUsd(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `$${compactFormatter.format(value)}`;
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatBalance(balance: string | null | undefined): string {
  if (!balance) return '—';
  const num = Number(balance);
  if (Number.isNaN(num)) return balance;
  if (num === 0) return '0';
  if (num < 0.0001) return num.toExponential(2);
  return num.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

export function shortenAddress(address: string | null | undefined): string {
  if (!address) return '—';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
