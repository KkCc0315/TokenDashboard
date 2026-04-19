"use client";

import Link from "next/link";

export default function WatchlistError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white/90 p-8 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-500">Watchlist error</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">{error.message || "Unable to load your watchlist"}</h1>
        <p className="mt-3 text-sm text-slate-600">
          There was a problem loading your watchlist data. You can try again or return to the dashboard.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-ink hover:text-ink"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
