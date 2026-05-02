import { InputHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={cn(
          'h-10 w-full rounded-md border bg-bg-subtle px-3 text-sm text-text placeholder:text-text-subtle',
          'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 focus:ring-offset-bg',
          error ? 'border-danger' : 'border-border',
          className,
        )}
        {...rest}
      />
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-subtle">{hint}</p>
      ) : null}
    </div>
  );
});
