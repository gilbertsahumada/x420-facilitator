import { Context, Next } from 'hono';
import { getCorsHeaders } from '@/utils/cors';
import type { Env } from '@/types';

export function corsMiddleware() {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    // Handle preflight requests
    if (c.req.method === 'OPTIONS') {
      const origin = c.req.header('Origin');
      const corsHeaders = getCorsHeaders(c.env, origin);

      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Continue with request
    await next();

    // Add CORS headers to response
    const origin = c.req.header('Origin');
    const corsHeaders = getCorsHeaders(c.env, origin);

    Object.entries(corsHeaders).forEach(([key, value]) => {
      c.res.headers.set(key, value);
    });
  };
}
