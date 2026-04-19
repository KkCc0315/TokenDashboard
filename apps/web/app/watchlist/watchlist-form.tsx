"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import type { Token } from "@/lib/types";
import { addWatchlistItemAction } from "./actions";

export function WatchlistForm({ tokens }: { tokens: Token[] }) {
  const [state, formAction] = useActionState(addWatchlistItemAction, INITIAL_ACTION_STATE);

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-soft">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Manage watchlist</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Add or update a tracked token</h2>
      <p className="mt-3 text-sm text-slate-600">
        Submitting the same token again updates the saved note, threshold, and direction for your account.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <label htmlFor="watchlist-token" className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Token</span>
          <select
            id="watchlist-token"
            className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
            name="tokenId"
            required
          >
            {tokens.map((token) => (
              <option key={token.id} value={token.id}>
                {token.name} ({token.symbol})
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label
            htmlFor="watchlist-condition"
            className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Alert when price goes</span>
            <select
              id="watchlist-condition"
              className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
              name="alertCondition"
              defaultValue="ABOVE"
            >
              <option value="ABOVE">Above target</option>
              <option value="BELOW">Below target</option>
            </select>
          </label>

          <label htmlFor="watchlist-price" className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Target price</span>
            <input
              id="watchlist-price"
              className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
              name="targetPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="175.00"
              required
            />
          </label>
        </div>

        <label htmlFor="watchlist-note" className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Note</span>
          <textarea
            id="watchlist-note"
            className="mt-2 h-28 w-full resize-none border-0 bg-transparent p-0 text-sm text-ink outline-none"
            name="note"
            placeholder="What are you watching for?"
            required
          />
        </label>

        {state.error ? (
          <p className="text-sm text-rose-600" role="alert" aria-live="polite">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="text-sm text-emerald-600" role="status" aria-live="polite">
            Watchlist item saved.
          </p>
        ) : null}

        <SubmitButton pendingText="Saving...">Save watchlist item</SubmitButton>
      </form>
    </article>
  );
}
