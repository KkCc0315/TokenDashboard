import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-bg-subtle px-6 py-12 text-center">
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-text-muted">{description}</p>
      )}
      {action}
    </div>
  );
}
