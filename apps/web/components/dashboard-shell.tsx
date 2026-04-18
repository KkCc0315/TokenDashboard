import { logoutAction } from "@/app/login/actions";
import type { AuthenticatedUser } from "@/lib/types";
import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/wallets", label: "Wallets" },
  { href: "/settings", label: "Settings" }
] as const;

export function DashboardShell({
  title,
  eyebrow,
  description,
  children,
  user
}: {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
  user?: AuthenticatedUser | null;
}) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="card-sheen rounded-[32px] border border-white/60 bg-white/80 p-4 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Token Intelligence Hub</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">{description}</p>
            </div>

            <div className="rounded-[28px] bg-ink px-5 py-4 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{eyebrow}</p>
              {user ? (
                <div className="mt-2 space-y-3 text-sm text-white/80">
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-white/50 hover:bg-white/10"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              ) : (
                <p className="mt-2 text-sm text-white/80">
                  Protected access uses a session cookie backed by the API JWT.
                </p>
              )}
            </div>
          </div>

          <nav className="mt-8 flex flex-wrap gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-200 bg-mist px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-ink hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            {!user ? (
              <Link
                href="/login"
                className="rounded-full border border-slate-200 bg-mist px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-ink hover:text-ink"
              >
                Login
              </Link>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
