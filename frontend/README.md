# Token Dashboard — Frontend

Next.js (App Router) + TypeScript + Tailwind frontend for the Token Aggregation Dashboard.

## Stack

- Next.js 15 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS 3
- Native `fetch` (no Axios)

## Setup

```bash
cd frontend
cp .env.local.example .env.local        # Then edit if backend runs elsewhere
npm install
npm run dev                              # http://localhost:3000
```

Backend must be running at `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:3001`).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier write |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with CTAs |
| `/tokens` | Public token explorer (search, sort, paginate) |
| `/tokens/[symbol]` | Token detail + watchlist toggle |
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard/watchlist` | Authenticated user watchlist |
| `/wallet-checker` | EVM wallet lookup |

## Architecture

- `src/app/*` — App Router pages and layouts
- `src/components/` — Reusable UI grouped by domain (`layout`, `tokens`, `forms`, `ui`)
- `src/services/` — Backend API calls (one module per resource)
- `src/lib/` — `api.ts` (fetch wrapper + error formatting), `auth.tsx` (context + token storage), `format.ts`
- `src/types/` — Shared response/request types matching backend contracts
- `src/hooks/` — Reusable React hooks

API responses mirror the NestJS backend exactly; types live in `src/types/`. The auth token is stored in `localStorage` under `td.token`.

## Key UI decisions

- Dark Web3-styled palette by default (`tailwind.config.ts`).
- All loading/empty/error states are explicit components in `src/components/ui/`.
- Auth state is read from a single `AuthProvider`; protected pages use `<ProtectedRoute>`.

## Known limitations

- No charts — token detail shows numeric stats only.
- Wallet lookup requires a Moralis API key on the backend.
- No SSR data fetching; all calls happen client-side so the JWT in localStorage can be attached.
