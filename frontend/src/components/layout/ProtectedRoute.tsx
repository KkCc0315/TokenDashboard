'use client';

import Link from 'next/link';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isReady, isAuthenticated, redirectTo, router]);

  if (!isReady) {
    return (
      <Container className="flex min-h-[40vh] items-center justify-center">
        <Spinner size={28} />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-lg font-semibold text-text">Sign in required</h2>
        <p className="max-w-sm text-sm text-text-muted">
          You need an account to view this page. Sign in or create one to continue.
        </p>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="primary">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Register</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
}
