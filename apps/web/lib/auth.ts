import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthenticatedUser } from "@/lib/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";
export const SESSION_COOKIE_NAME = "token-dashboard-session";

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function requireSessionToken() {
  const token = await getSessionToken();

  if (!token) {
    redirect("/login");
  }

  return token;
}

export async function createSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/"
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

async function fetchCurrentUser(token: string) {
  return fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetchCurrentUser(token);

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as AuthenticatedUser;
  } catch {
    return null;
  }
}

export async function requireUserSession() {
  const token = await requireSessionToken();

  try {
    const response = await fetchCurrentUser(token);

    if (!response.ok) {
      redirect("/login");
    }

    return (await response.json()) as AuthenticatedUser;
  } catch {
    redirect("/login");
  }
}
