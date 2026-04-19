import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "token-dashboard-session";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";
const REFRESH_THRESHOLD_SECONDS = 6 * 60 * 60; // 6 hours

function decodeTokenPayload(token: string): { exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    return payload;
  } catch {
    return null;
  }
}

function isTokenExpiringSoon(token: string): boolean {
  const payload = decodeTokenPayload(token);
  if (!payload?.exp) return false;
  const secondsRemaining = payload.exp - Math.floor(Date.now() / 1000);
  return secondsRemaining > 0 && secondsRemaining < REFRESH_THRESHOLD_SECONDS;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token || !isTokenExpiringSoon(token)) {
    return NextResponse.next();
  }

  try {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });

    if (!refreshResponse.ok) {
      return NextResponse.next();
    }

    const { accessToken } = (await refreshResponse.json()) as { accessToken: string };
    const response = NextResponse.next();
    response.cookies.set(SESSION_COOKIE_NAME, accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/"
    });
    return response;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login).*)"]
};
