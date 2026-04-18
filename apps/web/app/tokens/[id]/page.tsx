import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { getTokenById } from "@/lib/api";
import { requireUserSession } from "@/lib/auth";
import { formatCurrency, formatCompact } from "@/lib/format";

export default async function TokenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUserSession();
  const { id } = await params;
  const token = await getTokenById(id);

  if (!token) {
    notFound();
  }

  return (
    <DashboardShell
      eyebrow={token.chain}
      title={`${token.name} (${token.symbol})`}
      description={token.description}
      user={user}
    >
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{token.category}</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">{formatCurrency(token.price)}</h2>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${token.change24h >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
            >
              {token.change24h >= 0 ? "+" : ""}
              {token.change24h}% 24h
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Market cap</p>
              <p className="mt-2 text-lg font-semibold text-ink">{formatCompact(token.marketCap)}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">24h volume</p>
              <p className="mt-2 text-lg font-semibold text-ink">{formatCompact(token.volume24h)}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Liquidity</p>
              <p className="mt-2 text-lg font-semibold text-ink">{token.liquidity}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Holders</p>
              <p className="mt-2 text-lg font-semibold text-ink">{token.holders}</p>
            </div>
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-[28px] bg-ink p-6 text-white shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Execution notes</p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>Connect on-chain metadata and DEX liquidity snapshots here.</li>
              <li>Show wallet overlap and smart money tags in a second iteration.</li>
              <li>Use the watchlist to arm price alerts while notification delivery is being built.</li>
            </ul>
          </article>

          <Link
            href="/"
            className="block rounded-[28px] border border-slate-200 bg-white/90 px-6 py-5 text-sm font-medium text-slate-700 shadow-soft transition hover:border-ink hover:text-ink"
          >
            Back to dashboard
          </Link>
        </aside>
      </section>
    </DashboardShell>
  );
}
