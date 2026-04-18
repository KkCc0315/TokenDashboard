"use server";

import { revalidatePath } from "next/cache";
import { updateUserPreferences, updateUserProfile } from "@/lib/api";
import type { ActionState } from "@/lib/action-state";

export async function updateProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !email) {
    return { error: "Name and email are required.", success: false };
  }

  try {
    await updateUserProfile({ name, email });
  } catch {
    return { error: "Failed to update profile. Please try again.", success: false };
  }

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/watchlist");
  revalidatePath("/wallets");
  return { error: null, success: true };
}

export async function updatePreferencesAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const theme = String(formData.get("theme") ?? "system").trim();
  const defaultChain = String(formData.get("defaultChain") ?? "All").trim();
  const compactNumbers = formData.get("compactNumbers") === "on";

  try {
    await updateUserPreferences({ theme, defaultChain, compactNumbers });
  } catch {
    return { error: "Failed to update preferences. Please try again.", success: false };
  }

  revalidatePath("/");
  revalidatePath("/settings");
  return { error: null, success: true };
}
