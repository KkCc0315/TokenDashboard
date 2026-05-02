import { request } from '@/lib/api';
import { HealthResponse } from '@/types/health';

export function getHealth() {
  return request<HealthResponse>('/health');
}
