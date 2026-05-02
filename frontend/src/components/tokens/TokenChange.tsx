import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format';

interface TokenChangeProps {
  value: number | null | undefined;
  className?: string;
}

export function TokenChange({ value, className }: TokenChangeProps) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return <span className={cn('text-text-muted', className)}>—</span>;
  }
  const positive = value >= 0;
  return (
    <span
      className={cn(
        'tabular-nums',
        positive ? 'text-success' : 'text-danger',
        className,
      )}
    >
      {formatPercent(value)}
    </span>
  );
}
