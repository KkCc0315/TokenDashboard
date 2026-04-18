import { DashboardShell } from "@/components/dashboard-shell";
import { getDashboardData } from "@/lib/api";
import { requireUserSession } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";

export default async function WalletsPage() {
  const user = await requireUserSession();
  const data = await getDashboardData();
  const wallet = data.wallets[0];

  return (
    <DashboardShell
      eyebrow="Portfolio lens"
      title="Wallet Overview"
      description="Cached wallet and token balances remain available here, but the surrounding route now requires an authenticated session before loading dashboard data."
      user={user}
    >
      <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tracked wallet</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">{wallet.address}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total value</p>
              <p className="mt-2 text-xl font-semibold text-ink">{formatCurrency(wallet.totalValue)}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Realized PnL</p>
              <p className="mt-2 text-xl font-semibold text-emerald-600">+{wallet.realizedPnl}%</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {wallet.tokens.map((holding) => (
            <article key={holding.tokenId} className="rounded-[28px] bg-gradient-to-br from-mist to-white px-5 py-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{holding.tokenId.toUpperCase()}</p>
              <p className="mt-3 text-2xl font-semibold text-ink">{holding.balance}</p>
              <p className="mt-2 text-sm text-slate-600">{formatCurrency(holding.valueUsd)}</p>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
