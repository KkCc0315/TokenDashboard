# Token Aggregation Dashboard

A monorepo scaffold for a token aggregation dashboard with:

- `apps/web`: Next.js 15 + React 19 + Tailwind CSS frontend
- `apps/api`: NestJS 11 backend APIs
- MySQL-ready Prisma schema for persistence
- In-memory cache abstraction for market data

## Product scope

- Browsing, searching, and filtering tokens
- Viewing token details
- Tracking a watchlist with price alerts
- Wallet and token summaries
- Cached market data with background refresh
- Login, registration, and saved preferences
- Background market refresh and alert evaluation jobs

## Local setup

1. Install Node.js 20+ and npm 10+.
2. Copy [`.env.example`](.env.example) to `.env` and set `JWT_SECRET` to a secure random string.
3. Start MySQL and Redis with `npm run db:up` (requires Docker).
4. Run `npm install`.
5. Run `npx prisma db push --schema apps/api/prisma/schema.prisma` to apply the database schema.
6. Run `npm run dev`.
7. Open `http://localhost:3000` for the web app and `http://localhost:4000/api/tokens` for the API.

## Scripts

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start both frontend and backend concurrently |
| `npm run dev:web`      | Start Next.js on :3000                       |
| `npm run dev:api`      | Start NestJS on :4000 (watch mode)           |
| `npm run build`        | Build all workspaces                         |
| `npm run lint`         | Lint all workspaces                          |
| `npm run format`       | Format all files with Prettier               |
| `npm run format:check` | Check formatting without writing             |
| `npm run type-check`   | TypeScript check all workspaces              |
| `npm test`             | Run all tests                                |
| `npm run db:up`        | Start MySQL and Redis via Docker Compose     |
| `npm run db:down`      | Stop Docker Compose containers               |

## Environment variables

See [`.env.example`](.env.example) for all required variables. Key ones:

| Variable                   | Required | Description                                                        |
| -------------------------- | -------- | ------------------------------------------------------------------ |
| `DATABASE_URL`             | Yes      | MySQL connection string                                            |
| `JWT_SECRET`               | Yes      | Secret for signing JWTs (must not be "change-me")                  |
| `NEXT_PUBLIC_API_BASE_URL` | No       | API URL for frontend (default: `http://localhost:4000/api`)        |
| `CORS_ORIGINS`             | No       | Comma-separated allowed origins (default: `http://localhost:3000`) |
| `PORT`                     | No       | API server port (default: `4000`)                                  |

## Notes

- The frontend falls back to local mock data for public market, token, and wallet views when the API is not reachable.
- Authentication, user preferences, watchlists, refreshed market snapshots, and alert events use Prisma-backed persistence when the database is available.
- Background jobs refresh token and market snapshots on an interval, then evaluate watchlist thresholds so alert state can change even when no user is actively browsing the dashboard.
- A health check endpoint is available at `GET /api/health`.
