FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json apps/api/
COPY tsconfig.base.json ./
RUN npm ci --workspace api
COPY apps/api apps/api
RUN npm run build --workspace api
RUN npm run prisma:generate --workspace api

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
CMD ["node", "dist/main"]
