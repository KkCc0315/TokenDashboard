# Token Aggregation Dashboard

A monorepo scaffold for a token aggregation dashboard with:

- `apps/web`: Next.js + React + Tailwind frontend
- `apps/api`: NestJS backend APIs
- MySQL-ready Prisma schema for persistence
- Redis-style cache abstraction for market data and upstream blockchain responses

## Product scope

The first pass includes UI and API structure for:

- browsing tokens
- searching and filtering tokens
- viewing token details
- tracking a watchlist
- seeing wallet and token summaries
- cached market data
- login and saved preferences
- background market refresh and alert evaluation jobs

## Local setup

1. Install Node.js 20+ and npm 10+ on the machine.
2. Copy [`.env.example`](/D:/My%20Project/.env.example) to `.env`.
3. Optionally start MySQL and Redis with `docker compose up -d mysql redis`.
4. Run `npm install` from `D:\My Project`.
5. Run `npx prisma db push --schema apps/api/prisma/schema.prisma` to apply the auth, watchlist, market snapshot, and alert tables.
6. Run `npm run dev`.
7. Open `http://localhost:3000` for the web app and `http://localhost:4000/api/tokens` for the API.

## Notes

- The frontend still falls back to local mock data for public market, token, and wallet views when the API is not reachable.
- Authentication, user preferences, watchlists, refreshed market snapshots, and alert events use Prisma-backed persistence when the database is available.
- Background jobs refresh token and market snapshots on an interval, then evaluate watchlist thresholds so alert state can change even when no user is actively browsing the dashboard.
- Notification delivery is still a follow-up step, but alert events are now persisted so email, push, or webhook handlers can be added without redesigning the watchlist model.
