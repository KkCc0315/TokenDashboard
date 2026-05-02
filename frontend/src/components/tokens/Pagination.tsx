'use client';

import { Button } from '@/components/ui/Button';

interface PaginationProps {
  page: number;
  hasNext: boolean;
  onChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ page, hasNext, onChange, isLoading }: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-text-muted">Page {page}</span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1 || isLoading}
          onClick={() => onChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasNext || isLoading}
          onClick={() => onChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
