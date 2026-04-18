"use server";

import { redirect } from "next/navigation";
import { API_BASE_URL, clearSession, createSession } from "@/lib/auth";

export type AuthActionState = {
  error: string | null;
};

const INITIAL_STATE: AuthActionState = {
  error: null
};

function getMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object" || !("message" in payload)) {
    return fallback;
  }

  const message = (payload as { message?: string | string[] }).message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message ?? fallback;
}

async function authenticate(path: "login" | "register", formData: FormData, fallbackMessage: string) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  const payload = path === "register" ? { email, password, name } : { email, password };
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });
  } catch {
    return {
      error: "Unable to reach the API. Confirm the backend is running on http://localhost:4000."
    } satisfies AuthActionState;
  }

  if (!response.ok) {
    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return {
      error: getMessage(body, fallbackMessage)
    } satisfies AuthActionState;
  }

  const body = (await response.json()) as { accessToken: string };
  await createSession(body.accessToken);
  redirect("/");
}

export async function loginAction(_previousState: AuthActionState = INITIAL_STATE, formData: FormData) {
  return authenticate("login", formData, "Unable to sign in");
}

export async function registerAction(_previousState: AuthActionState = INITIAL_STATE, formData: FormData) {
  return authenticate("register", formData, "Unable to create account");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
