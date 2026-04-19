"use server";

import { redirect } from "next/navigation";
import { API_BASE_URL, clearSession, createSession } from "@/lib/auth";
import { extractMessage } from "@/lib/error-message";
import { loginSchema, registerSchema } from "@/lib/schemas";

export type AuthActionState = {
  error: string | null;
};

const INITIAL_STATE: AuthActionState = {
  error: null
};

async function authenticate(path: "login" | "register", formData: FormData, fallbackMessage: string) {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    name: String(formData.get("name") ?? "")
  };

  const schema = path === "register" ? registerSchema : loginSchema;
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message } satisfies AuthActionState;
  }

  const payload = parsed.data;
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
      error: extractMessage(body, fallbackMessage)
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
