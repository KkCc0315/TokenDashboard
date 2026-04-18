# Architecture Notes

## Apps

### `apps/web`

- Next.js App Router UI
- responsive dashboard with token browser, watchlist, wallet summaries, and detail pages
- server-side data loaders with graceful fallback to local mock data
- http-only session cookie that stores the API JWT for protected routes

### `apps/api`

- NestJS REST API with domain modules:
  - auth
  - users
  - tokens
  - wallets
  - watchlist
  - market
  - cache
- global `/api` prefix for browser-friendly local development
- Prisma-backed user, preference, and watchlist persistence
- JWT guard for authenticated user endpoints

## Data strategy

- Token, wallet, and market responses are still mocked for the localhost milestone.
- A Redis-style cache service wraps upstream lookups with TTL-based storage.
- Prisma now stores password hashes, user preferences, and per-user watchlists in MySQL.

## Suggested next steps

1. Add a Prisma migration or seed flow for local demo accounts if the team wants one-click evaluation data.
2. Connect a real blockchain data source such as Moralis, Alchemy, Covalent, or Bitquery.
3. Add session revocation or refresh-token handling if longer-lived sessions are required.
4. Introduce a worker for price alerts and notification delivery.
