"use server";

import { revalidatePath } from "next/cache";
import { createWatchlistItem, removeWatchlistItem } from "@/lib/api";
import type { ActionState } from "@/lib/action-state";
import type { AlertCondition } from "@/lib/types";

export async function addWatchlistItemAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const tokenId = String(formData.get("tokenId") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const targetPrice = Number(formData.get("targetPrice") ?? Number.NaN);
  const alertCondition = String(formData.get("alertCondition") ?? "ABOVE")
    .trim()
    .toUpperCase() as AlertCondition;

  if (!tokenId || !note || !Number.isFinite(targetPrice)) {
    return { error: "Token, note, and a valid target price are required.", success: false };
  }

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
