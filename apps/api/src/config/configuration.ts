export default () => ({
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "mysql://dashboard:dashboard@localhost:3306/token_dashboard",
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  marketCacheTtl: Number(process.env.MARKET_CACHE_TTL ?? 45),
  marketRefreshIntervalSeconds: Number(process.env.MARKET_REFRESH_INTERVAL_SECONDS ?? 60),
  alertEvaluationIntervalSeconds: Number(process.env.ALERT_EVALUATION_INTERVAL_SECONDS ?? 60)
});
