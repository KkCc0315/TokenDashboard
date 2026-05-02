import { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'success' | 'danger' | 'brand';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const TONES: Record<Tone, string> = {
  neutral: 'bg-bg-subtle text-text-muted border-border',
  success: 'bg-success/10 text-success border-success/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  brand: 'bg-brand-soft text-brand border-brand/30',
};

export function Badge({ className, tone = 'neutral', ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
      {...rest}
    />
  );
}
