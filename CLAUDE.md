# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack cryptocurrency token aggregation dashboard — monorepo with a Next.js 15 frontend and NestJS 11 backend, connected to MySQL via Prisma ORM.

## Commands

### Development

```bash
# Run both apps concurrently
npm run dev

# Run individually
npm run dev:web       # Next.js on :3000
npm run dev:api       # NestJS on :4000 (watch mode)
```

### Build & Lint

```bash
npm run build         # Build all workspaces
npm run lint          # Lint all workspaces

# Per-workspace
npm run build --workspace web
npm run build --workspace api
npm run lint --workspace api   # ESLint on src/**/*.ts
npm run lint --workspace web   # next lint
```

### Database

```bash
npm run db:up                              # Start MySQL via Docker Compose
npm run db:down                            # Stop containers
npm run prisma:generate --workspace api    # Regenerate Prisma client after schema changes
cd apps/api && npx prisma db push          # Apply schema changes to DB (no migration files — use db push in dev)
```

### Testing

```bash
npm test                          # Run all tests
npm run test --workspace api      # API tests only
npm run test:cov --workspace api  # API tests with coverage
```

### Formatting & Type-Checking

```bash
npm run format                    # Prettier — format all files
npm run format:check              # Prettier — check without writing
npm run type-check                # TypeScript — check all workspaces
```

## Architecture

### Monorepo Structure

- `apps/web/` — Next.js 15 (App Router, React 19, TypeScript, Tailwind CSS)
- `apps/api/` — NestJS 11 (REST API, TypeScript, CommonJS output)
- `tsconfig.base.json` — Shared TS config (strict mode, ES2022, Bundler resolution)
- `.env` — Single env file at root; API reads `DATABASE_URL`, `JWT_SECRET`, cache/job intervals

### Backend (NestJS)

All routes are prefixed with `/api`. CORS is restricted to `http://localhost:3000`.

Module loading order in `app.module.ts`:

1. ConfigModule → DatabaseModule → CacheModule
2. AuthModule → UsersModule → TokensModule → WalletsModule → WatchlistModule → MarketModule
3. JobsModule (depends on Market + Watchlist)

**Key patterns:**

- `JwtAuthGuard` protects all non-auth routes; `@CurrentUser()` extracts user ID from JWT claims
- `CacheService` is a simple in-memory TTL store — not Redis; cache is cleared when background jobs refresh market data
- `JobsModule` starts two `setInterval` loops on `onModuleInit`: market snapshot refresh and alert evaluation (both default 60s, configurable via env)
- DTOs use `class-validator` + global `ValidationPipe({ whitelist: true, transform: true })`
- `PrismaService` is a singleton shared across all modules via `DatabaseModule`

**Market data is entirely synthetic.** There is no external crypto API. `MarketDataService.buildSyntheticTokens()` generates prices deterministically using sine waves on 1-minute time buckets, starting from seed tokens defined in `apps/api/src/common/mock-data.ts`. Both `MarketDataService` and `WatchlistService` fall back to generated data if the DB is unreachable — the API works without a database connection.

**Wallets are fully mocked.** `WalletsService` only handles the `demo-wallet` address; all wallet data comes from `common/mock-data.ts`. Real wallet integration is not implemented.

**Alert flow:** WatchlistItems have `alertCondition` (ABOVE/BELOW) and `alertState` (ARMED/TRIGGERED). The job evaluates all ARMED items against current token prices, creates `AlertEvent` records, and updates state to TRIGGERED when threshold is crossed. Creating a watchlist item for an already-tracked token upserts and re-ARMs the alert.

**Prisma schema key models:** `User`, `UserPreference` (1:1), `WatchlistItem`, `AlertEvent`, `RefreshedToken` (market snapshot cache in DB), `MarketOverview` (single row, id: `"latest"`).

### Frontend (Next.js)

Uses App Router with React Server Components. Import alias `@/*` maps to `apps/web/*`.

**Auth:** `requireUserSession()` in `lib/auth.ts` reads the JWT from an HTTP-only cookie (`token-dashboard-session`, 24h TTL) and redirects to `/login` if missing/invalid. All protected pages call this at the top.

**API calls:** `lib/api.ts` has three fetch patterns with different error semantics:

- `request()` — read-only GETs; silently falls back to `lib/mock-data.ts` on any failure; returns `{ data, source }`
- `requestPersisted()` — throws on failure; used in auth-critical paths where a fallback is inappropriate
- `authenticatedMutation()` — always requires a JWT; throws on failure; used for all write operations (POST/PATCH/DELETE)

**Mutations:** Use Next.js Server Actions (in `app/login/` and similar). No client-side fetch for writes.

**Tailwind custom tokens:**

- Colors: `ink` (dark navy), `mist` (light cyan), `tide` (teal), `ember` (orange), `glow` (yellow)
- Shadow: `soft`

## Code Style

- **Comments:** Use sparingly — only on genuinely complex or non-obvious logic.

### Environment Variables

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
PORT=4000
DATABASE_URL=mysql://dashboard:dashboard@localhost:3306/token_dashboard
JWT_SECRET=change-me
MARKET_CACHE_TTL=45
MARKET_REFRESH_INTERVAL_SECONDS=60
ALERT_EVALUATION_INTERVAL_SECONDS=60
```
