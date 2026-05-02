'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Container } from '@/components/ui/Container';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/cn';

const NAV_LINKS = [
  { href: '/tokens', label: 'Tokens' },
  { href: '/wallet-checker', label: 'Wallet Lookup' },
  { href: '/dashboard/watchlist', label: 'Watchlist' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isReady, signOut, user } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-bg/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-text">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand text-white">
            T
          </span>
          <span>TokenDashboard</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-bg-panel text-text'
                    : 'text-text-muted hover:bg-bg-panel hover:text-text',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!isReady ? null : isAuthenticated ? (
            <>
              <span className="hidden text-xs text-text-muted sm:inline" title={user?.email}>
                {user?.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-text-muted hover:text-text"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm text-text-muted hover:text-text"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
