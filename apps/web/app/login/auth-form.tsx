"use client";

import { useActionState, useState } from "react";
import type { AuthActionState } from "./actions";
import { loginAction, registerAction } from "./actions";

const initialState: AuthActionState = {
  error: null
};

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [loginState, loginFormAction, loginPending] = useActionState(loginAction, initialState);
  const [registerState, registerFormAction, registerPending] = useActionState(registerAction, initialState);
  const state = mode === "login" ? loginState : registerState;
  const formAction = mode === "login" ? loginFormAction : registerFormAction;
  const isPending = mode === "login" ? loginPending : registerPending;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 rounded-full bg-slate-100 p-1 text-sm font-medium text-slate-600">
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`rounded-full px-4 py-2 transition ${mode === "register" ? "bg-white text-ink shadow-sm" : "text-slate-500"}`}
        >
          Create account
        </button>
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-full px-4 py-2 transition ${mode === "login" ? "bg-white text-ink shadow-sm" : "text-slate-500"}`}
        >
          Sign in
        </button>
      </div>

      <form action={formAction} className="space-y-4">
        {mode === "register" ? (
          <label className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Name</span>
            <input
              className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
              name="name"
              placeholder="Dashboard Operator"
              required
            />
          </label>
        ) : null}

        <label className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Email</span>
          <input
            className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Password</span>
          <input
            className="mt-2 w-full border-0 bg-transparent p-0 text-sm text-ink outline-none"
            name="password"
            type="password"
            minLength={8}
            placeholder="At least 8 characters"
            required
          />
        </label>

        {state.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}

        <button
          type="submit"
          className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
        >
          {isPending ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
