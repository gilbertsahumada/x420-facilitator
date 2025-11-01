import type { Env } from '@/types';

export function getCorsHeaders(env: Env, origin?: string | null): Record<string, string> {
  const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') || ['*'];

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };

  // Si hay un origen específico y está en la lista permitida
  if (origin && allowedOrigins.includes('*')) {
    headers['Access-Control-Allow-Origin'] = '*';
  } else if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  } else if (allowedOrigins.length === 1 && allowedOrigins[0] !== '*') {
    headers['Access-Control-Allow-Origin'] = allowedOrigins[0];
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return headers;
}

export function addCorsHeaders(headers: Headers, env: Env, origin?: string | null): void {
  const corsHeaders = getCorsHeaders(env, origin);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
}
