import { Context } from 'hono';
import type { Env, HealthResponse } from '@/types';

export async function healthHandler(c: Context<{ Bindings: Env }>): Promise<Response> {
  try {
    const response: HealthResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: c.env.ENVIRONMENT,
    };

    return c.json(response, 200);
  } catch (error) {
    const response: HealthResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: c.env.ENVIRONMENT,
    };

    return c.json(response, 503);
  }
}
