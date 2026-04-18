"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, TrendingUp, Wallet } from "lucide-react";
import { formatCurrency, formatLargeNumber } from "@/lib/format";
import type { DashboardData, UserPreference } from "@/lib/types";

export function TokenBrowser({ data, preferences }: { data: DashboardData; preferences?: UserPreference | null }) {
  const [search, setSearch] = useState("");
  const [chain, setChain] = useState(preferences?.defaultChain ?? "All");
  const [category, setCategory] = useState("All");
  const compactNumbers = preferences?.compactNumbers ?? true;

  const chains = ["All", ...new Set(data.tokens.map((token) => token.chain))];
  const categories = ["All", ...new Set(data.tokens.map((token) => token.category))];

  const filteredTokens = useMemo(() => {
    const term = search.trim().toLowerCase();

    return data.tokens.filter((token) => {
      const matchesSearch =
        term.length === 0 || token.name.toLowerCase().includes(term) || token.symbol.toLowerCase().includes(term);
      const matchesChain = chain === "All" || token.chain === chain;
      const matchesCategory = category === "All" || token.category === category;

      return matchesSearch && matchesChain && matchesCategory;
    });
  }, [category, chain, data.tokens, search]);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Token browser</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Search, filter, and scan live-ready assets</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
              <Search className="h-4 w-4" aria-hidden="true" />
              Cached market lookups ready for API wiring
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <div
              className={`rounded-full px-4 py-2 text-sm font-medium ${data.dataSource === "api" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
            >
              {data.dataSource === "api" ? "Live API data" : "Fallback demo data"}
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
              API base: {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api"}
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
              Number format: {compactNumbers ? "Compact" : "Full"}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
            <label htmlFor="token-search" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Search</span>
              <input
                id="token-search"
                className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
                placeholder="SOL, LINK, RWA..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label htmlFor="chain-filter" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Chain</span>
              <select
                id="chain-filter"
                className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
                value={chain}
                onChange={(event) => setChain(event.target.value)}
              >
                {chains.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label htmlFor="category-filter" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Category</span>
              <select
                id="category-filter"
                className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {filteredTokens.map((token) => (
              <Link
                key={token.id}
                href={`/tokens/${token.id}`}
                className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-mist p-5 transition hover:-translate-y-1 hover:border-ink"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{token.category}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-ink">
                      {token.name} <span className="text-slate-400">{token.symbol}</span>
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">{token.description}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                    {token.chain}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Price</p>
                    <p className="mt-2 text-xl font-semibold text-ink">{formatCurrency(token.price)}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">24h</p>
                    <p
                      className={`mt-2 text-xl font-semibold ${token.change24h >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {token.change24h >= 0 ? "+" : ""}
                      {token.change24h}%
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Mkt cap</p>
                    <p className="mt-2 text-lg font-semibold text-ink">
                      {formatLargeNumber(token.marketCap, compactNumbers)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Volume</p>
                    <p className="mt-2 text-lg font-semibold text-ink">
                      {formatLargeNumber(token.volume24h, compactNumbers)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <article className="rounded-[28px] bg-ink p-5 text-white shadow-soft">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-glow" aria-hidden="true" />
              <p className="text-sm uppercase tracking-[0.25em] text-white/60">Market cache</p>
            </div>
            <h3 className="mt-4 text-3xl font-semibold">{data.market.fearGreed}</h3>
            <p className="mt-1 text-sm text-white/70">Fear & Greed Index</p>
            <div className="mt-6 rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">Cache status</p>
              <p className="mt-2 text-lg font-medium capitalize">{data.market.cacheStatus}</p>
              <p className="mt-2 text-sm text-white/70">Updated {new Date(data.market.updatedAt).toLocaleString()}</p>
            </div>
            <div className="mt-4 rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">Trending</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.market.trending.map((symbol) => (
                  <span key={symbol} className="rounded-full bg-white/10 px-3 py-1 text-sm">
                    {symbol}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-ember" aria-hidden="true" />
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Wallet snapshot</p>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-ink">{formatCurrency(data.wallets[0].totalValue)}</h3>
            <p className="mt-1 text-sm text-slate-600">{data.wallets[0].address}</p>
            <div className="mt-4 space-y-3">
              {data.wallets[0].tokens.map((holding) => (
                <div
                  key={holding.tokenId}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{holding.tokenId.toUpperCase()}</p>
                    <p className="text-xs text-slate-500">{holding.balance} tokens</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">{formatCurrency(holding.valueUsd)}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Watchlist</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Priority tokens to revisit</h2>
          <div className="mt-5 space-y-3">
            {data.watchlist.map((item) => (
              <div key={item.tokenId} className="rounded-3xl bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-ink">{item.tokenId.toUpperCase()}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Target</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{formatCurrency(item.targetPrice)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Roadmap-ready capabilities</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Already shaped for the next backend passes</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "JWT login plus preference persistence",
              "Blockchain token and wallet integrations",
              "Redis-backed price and response cache",
              "MySQL-backed watchlist and settings storage",
              "Alert worker slots for price triggers",
              "Responsive dashboard patterns for ops and retail users"
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-gradient-to-br from-mist to-white px-4 py-4 text-sm text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
