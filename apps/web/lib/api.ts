import { redirect } from "next/navigation";
import { mockDashboardData, mockTokens } from "@/lib/mock-data";
import { API_BASE_URL, getSessionToken, requireSessionToken } from "@/lib/auth";
import type {
  AlertCondition,
  AuthenticatedUser,
  DashboardData,
  MarketSnapshot,
  Token,
  UserPreference,
  WalletSummary,
  WatchlistItem
} from "@/lib/types";

type RequestResult<T> = {
  data: T;
  source: "api" | "fallback";
};

type RequestOptions<T> = {
  fallback: T;
  token?: string | null;
  authRequired?: boolean;
};

type PersistedRequestOptions = {
  token?: string | null;
  authRequired?: boolean;
};

const defaultUserPreferences: UserPreference = {
  theme: "system",
  defaultChain: "All",
  compactNumbers: true
};

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { message?: string | string[] };

    if (Array.isArray(payload.message)) {
      return payload.message.join(", ");
    }

    if (payload.message) {
      return payload.message;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

async function request<T>(path: string, options: RequestOptions<T>): Promise<RequestResult<T>> {
  try {
    const headers = new Headers();

    if (options.token) {
      headers.set("Authorization", `Bearer ${options.token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers
    });

    if (response.status === 401 && options.authRequired) {
      redirect("/login");
    }

    if (!response.ok) {
      return {
        data: options.fallback,
        source: "fallback"
      };
    }

    return {
      data: (await response.json()) as T,
      source: "api"
    };
  } catch {
    return {
      data: options.fallback,
      source: "fallback"
    };
  }
}

async function requestPersisted<T>(path: string, options: PersistedRequestOptions = {}) {
  const headers = new Headers();

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers
  });

  if (response.status === 401 && options.authRequired) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Unable to load ${path}`));
  }

  return (await response.json()) as T;
}

async function authenticatedMutation<T = void>(path: string, init: RequestInit): Promise<T> {
  const token = await requireSessionToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {})
    }
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Request failed"));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getDashboardData(): Promise<DashboardData> {
  const token = await getSessionToken();
  const [tokens, watchlist, wallet, market] = await Promise.all([
    request<Token[]>("/tokens", { fallback: mockDashboardData.tokens }),
    request<WatchlistItem[]>("/watchlist", { fallback: [], token, authRequired: true }),
    request<WalletSummary>("/wallets/demo-wallet", { fallback: mockDashboardData.wallets[0] }),
    request<MarketSnapshot>("/market/overview", { fallback: mockDashboardData.market })
  ]);

  const dataSource = [tokens, wallet, market].every((result) => result.source === "api") ? "api" : "fallback";

  return {
    tokens: tokens.data,
    watchlist: watchlist.data,
    wallets: [wallet.data],
    market: market.data,
    dataSource
  };
}

export async function getTokens() {
  const result = await request<Token[]>("/tokens", { fallback: mockDashboardData.tokens });
  return result.data;
}

export async function getTokenById(id: string): Promise<Token | undefined> {
  const fallback = mockTokens.find((token) => token.id === id);
  const result = await request<Token | undefined>(`/tokens/${id}`, { fallback });
  return result.data;
}

export async function getUserProfile() {
  const token = await requireSessionToken();
  const result = await request<AuthenticatedUser | null>("/users/me", {
    fallback: null,
    token,
    authRequired: true
  });

  if (!result.data) {
    redirect("/login");
  }

  return result.data;
}

export async function getUserPreferences() {
  const token = await requireSessionToken();
  const result = await request<UserPreference>("/users/me/preferences", {
    fallback: defaultUserPreferences,
    token,
    authRequired: true
  });

  return result.data;
}

export async function updateUserProfile(payload: { name?: string; email?: string }) {
  return authenticatedMutation<AuthenticatedUser>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function updateUserPreferences(payload: {
  theme?: string;
  defaultChain?: string;
  compactNumbers?: boolean;
}) {
  return authenticatedMutation<UserPreference>("/users/me/preferences", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function createWatchlistItem(payload: {
  tokenId: string;
  note: string;
  targetPrice: number;
  alertCondition?: AlertCondition;
}) {
  await authenticatedMutation("/watchlist", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function removeWatchlistItem(tokenId: string) {
  await authenticatedMutation(`/watchlist/${tokenId}`, {
    method: "DELETE"
  });
}
