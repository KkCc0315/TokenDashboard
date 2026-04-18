import { DashboardShell } from "@/components/dashboard-shell";
import { getDashboardData } from "@/lib/api";
import { requireUserSession } from "@/lib/auth";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { RemoveButton } from "./remove-button";
import { WatchlistForm } from "./watchlist-form";

export default async function WatchlistPage() {
  const user = await requireUserSession();
  const data = await getDashboardData();
  const tokenNames = new Map(data.tokens.map((token) => [token.id, token.name]));

  return (
    <DashboardShell
      eyebrow="Saved ideas"
      title="Watchlist"
      description="Watchlist alerts are evaluated in the background after market refresh runs, so thresholds stay armed even when no one has the page open."
      user={user}
    >
      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <WatchlistForm tokens={data.tokens} />

        <section className="grid gap-4">
          {data.watchlist.length === 0 ? (
            <article className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-8 text-center shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">No saved tokens</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">This account does not have a watchlist yet.</h2>
              <p className="mt-3 text-sm text-slate-600">Use the form to create the first per-user watchlist entry.</p>
            </article>
          ) : (
            data.watchlist.map((item) => {
              const isTriggered = item.alertState === "TRIGGERED";
              const conditionLabel = item.alertCondition === "BELOW" ? "Below" : "Above";
              const triggeredAt = formatDateTime(item.lastTriggeredAt);

              return (
                <article
                  key={item.tokenId}
                  className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-soft"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                        <span>{item.tokenId.toUpperCase()}</span>
                        <span
                          className={`rounded-full px-3 py-1 tracking-[0.18em] ${isTriggered ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
                        >
                          {isTriggered ? "Triggered" : "Armed"}
                        </span>
                      </div>
                      <h2 className="mt-3 text-2xl font-semibold text-ink">
                        {conditionLabel} {formatCurrency(item.targetPrice)}
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">{tokenNames.get(item.tokenId) ?? "Tracked token"}</p>
                      <p className="mt-4 text-sm text-slate-600">{item.note}</p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Current price</p>
                          <p className="mt-2 text-lg font-semibold text-ink">
                            {item.currentPrice == null ? "Unavailable" : formatCurrency(item.currentPrice)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Last trigger</p>
                          <p className="mt-2 text-sm font-medium text-ink">
                            {triggeredAt && item.lastTriggeredPrice != null
                              ? `${formatCurrency(item.lastTriggeredPrice)} on ${triggeredAt}`
                              : "Waiting for threshold cross"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <RemoveButton tokenId={item.tokenId} />
                  </div>
                </article>
              );
            })
          )}
        </section>
      </section>
    </DashboardShell>
  );
}
