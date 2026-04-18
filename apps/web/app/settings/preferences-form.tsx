"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import type { UserPreference } from "@/lib/types";
import { updatePreferencesAction } from "./actions";

export function PreferencesForm({ preferences, chains }: { preferences: UserPreference; chains: string[] }) {
  const [state, formAction] = useActionState(updatePreferencesAction, INITIAL_ACTION_STATE);

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-soft">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Preferences</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Dashboard defaults</h2>
      <p className="mt-3 text-sm text-slate-600">
        These preferences are persisted per user in MySQL and immediately affect the dashboard defaults after save.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <label htmlFor="pref-theme" className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Theme</span>
          <select
            id="pref-theme"
            className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
            name="theme"
            defaultValue={preferences.theme}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label htmlFor="pref-chain" className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Default chain</span>
          <select
            id="pref-chain"
            className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
            name="defaultChain"
            defaultValue={preferences.defaultChain}
          >
            {chains.map((chain) => (
              <option key={chain} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
          <input
            className="mt-1 h-4 w-4 rounded border-slate-300"
            name="compactNumbers"
            type="checkbox"
            defaultChecked={preferences.compactNumbers}
          />
          <span>Use compact number formatting on dashboard cards, such as 81.2B instead of 81,200,000,000.</span>
        </label>

        {state.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-emerald-600">Preferences updated.</p> : null}

        <SubmitButton pendingText="Saving...">Save preferences</SubmitButton>
      </form>
    </article>
  );
}
