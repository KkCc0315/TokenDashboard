"use server";

import { revalidatePath } from "next/cache";
import { createWatchlistItem, removeWatchlistItem } from "@/lib/api";
import type { ActionState } from "@/lib/action-state";
import { watchlistItemSchema } from "@/lib/schemas";

export async function addWatchlistItemAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = watchlistItemSchema.safeParse({
    tokenId: String(formData.get("tokenId") ?? ""),
    note: String(formData.get("note") ?? ""),
    targetPrice: Number(formData.get("targetPrice") ?? Number.NaN),
    alertCondition: String(formData.get("alertCondition") ?? "ABOVE")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  const { tokenId, note, targetPrice, alertCondition } = parsed.data;

  try {
    await createWatchlistItem({
      tokenId,
      note,
      targetPrice,
      alertCondition
    });
  } catch {
    return { error: "Failed to save watchlist item. Please try again.", success: false };
  }

  revalidatePath("/");
  revalidatePath("/watchlist");
  return { error: null, success: true };
}

export async function removeWatchlistItemAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const tokenId = String(formData.get("tokenId") ?? "").trim();

  if (!tokenId) {
    return { error: "Token ID is required.", success: false };
  }

  try {
    await removeWatchlistItem(tokenId);
  } catch {
    return { error: "Failed to remove watchlist item. Please try again.", success: false };
  }

  revalidatePath("/");
  revalidatePath("/watchlist");
  return { error: null, success: true };
}
