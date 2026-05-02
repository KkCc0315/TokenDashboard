import { ReactNode } from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  action?: ReactNode;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-xl border border-danger/30 bg-danger/5 p-5"
    >
      <h3 className="text-sm font-semibold text-danger">{title}</h3>
      <p className="text-sm text-text-muted">{message}</p>
      {action}
    </div>
  );
}
