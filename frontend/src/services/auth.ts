import { request } from '@/lib/api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types/auth';

export function login(payload: LoginRequest) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function register(payload: RegisterRequest) {
  return request<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}
