import { cn } from '@/lib/cn';

interface TokenLogoProps {
  src: string | null;
  symbol: string;
  size?: number;
  className?: string;
}

export function TokenLogo({ src, symbol, size = 28, className }: TokenLogoProps) {
  const dimension = `${size}px`;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${symbol} logo`}
        width={size}
        height={size}
        loading="lazy"
        className={cn('rounded-full bg-bg-subtle object-cover', className)}
        style={{ width: dimension, height: dimension }}
      />
    );
  }

  return (
    <div
      style={{ width: dimension, height: dimension }}
      className={cn(
        'grid place-items-center rounded-full bg-bg-subtle text-[10px] font-semibold text-text-muted',
        className,
      )}
    >
      {symbol.slice(0, 3).toUpperCase()}
    </div>
  );
}
