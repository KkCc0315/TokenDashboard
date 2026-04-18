"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { updateProfileAction } from "./actions";

export function ProfileForm({ user }: { user: { name: string; email: string } }) {
  const [state, formAction] = useActionState(updateProfileAction, INITIAL_ACTION_STATE);

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-soft">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Profile</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Account identity</h2>
      <p className="mt-3 text-sm text-slate-600">
        These values come from the authenticated user table and update the session-backed profile shown across the app.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <label htmlFor="profile-name" className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Name</span>
          <input
            id="profile-name"
            className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
            name="name"
            defaultValue={user.name}
            minLength={2}
            maxLength={80}
            required
          />
        </label>

        <label htmlFor="profile-email" className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Email</span>
          <input
            id="profile-email"
            className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
            name="email"
            type="email"
            defaultValue={user.email}
            required
          />
        </label>

        {state.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-emerald-600">Profile updated.</p> : null}

        <SubmitButton pendingText="Saving...">Save profile</SubmitButton>
      </form>
    </article>
  );
}
