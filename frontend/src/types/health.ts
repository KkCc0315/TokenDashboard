export interface HealthResponse {
  status: string;
  uptime?: number;
  database?: { status: string };
  cache?: { status: string };
}
