"use client";

import { useActionState } from "react";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { removeWatchlistItemAction } from "./actions";

export function RemoveButton({ tokenId }: { tokenId: string }) {
  const [state, formAction, pending] = useActionState(removeWatchlistItemAction, INITIAL_ACTION_STATE);

  return (
    <form action={formAction}>
      <input type="hidden" name="tokenId" value={tokenId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-300 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Removing..." : "Remove"}
      </button>
      {state.error ? <p className="mt-1 text-xs text-rose-600">{state.error}</p> : null}
    </form>
  );
}
