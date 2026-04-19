"use server";

import { revalidatePath } from "next/cache";
import { updateUserPreferences, updateUserProfile } from "@/lib/api";
import type { ActionState } from "@/lib/action-state";
import { preferencesSchema, profileSchema } from "@/lib/schemas";

export async function updateProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = profileSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  const { name, email } = parsed.data;

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
  const parsed = preferencesSchema.safeParse({
    theme: String(formData.get("theme") ?? "system"),
    defaultChain: String(formData.get("defaultChain") ?? "All"),
    compactNumbers: formData.get("compactNumbers") === "on"
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  const { theme, defaultChain, compactNumbers } = parsed.data;

  try {
    await updateUserPreferences({ theme, defaultChain, compactNumbers });
  } catch {
    return { error: "Failed to update preferences. Please try again.", success: false };
  }

  revalidatePath("/");
  revalidatePath("/settings");
  return { error: null, success: true };
}
