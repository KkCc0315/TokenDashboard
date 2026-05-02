# Token Dashboard Backend

NestJS backend for a token aggregation dashboard. It includes JWT auth, Prisma/MySQL persistence, Redis caching, token and wallet provider integration layers, and an admin maintenance endpoint.

## Stack

- NestJS
- TypeScript
- Prisma
- MySQL 8
- Redis 7
- JWT
- Docker Compose

## Local setup

1. Copy `.env.example` to `.env`.
2. Start infrastructure with `docker compose up -d`.
3. Install dependencies with `npm install`.
4. Generate Prisma client with `npm run prisma:generate`.
5. Run migrations with `npm run prisma:migrate:dev`.
6. Start the API with `npm run start:dev`.

## Key modules

- `auth`: registration, login, JWT handling
- `users`: user lookup and persistence helpers
- `watchlist`: authenticated watchlist CRUD
- `tokens`: token list/detail aggregation with Redis caching
- `wallet`: wallet lookup with provider abstraction and Redis caching
- `admin`: admin-only cache maintenance
- `health`: API, database, and Redis health checks

## Caching strategy

- Token list: `tokens:list:<serialized-query>`
- Token detail: `token:detail:<symbol>`
- Wallet lookup: `wallet:lookup:<address>`

`POST /admin/cache/clear` invalidates the token and wallet cache namespaces.

## Provider notes

- Token data defaults to CoinGecko-compatible endpoints.
- Wallet lookup expects a Moralis-compatible API key by default. You can replace the base URL and header strategy later when you provide infra details.

## Known limitations

- Wallet lookup depends on provider credentials.
- Admin access requires a user with the `ADMIN` role in the database.
- No background sync job is configured in v1.
