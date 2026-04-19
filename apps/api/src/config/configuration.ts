export interface AppConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  corsOrigins: string[];
  marketCacheTtl: number;
  marketRefreshIntervalSeconds: number;
  alertEvaluationIntervalSeconds: number;
}

export default (): AppConfig => {
  const databaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  if (jwtSecret === "change-me") {
    throw new Error("JWT_SECRET must be changed from the default value");
  }

  return {
    port: Number(process.env.PORT ?? 4000),
    databaseUrl,
    jwtSecret,
    corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000").split(",").map((o) => o.trim()),
    marketCacheTtl: Number(process.env.MARKET_CACHE_TTL ?? 45),
    marketRefreshIntervalSeconds: Number(process.env.MARKET_REFRESH_INTERVAL_SECONDS ?? 60),
    alertEvaluationIntervalSeconds: Number(process.env.ALERT_EVALUATION_INTERVAL_SECONDS ?? 60)
  };
};
