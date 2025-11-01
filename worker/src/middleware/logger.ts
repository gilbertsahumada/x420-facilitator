import { Context, Next } from 'hono';
import type { Env } from '@/types';
import { createLogger } from '@/utils/logger';

export function loggerMiddleware() {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const logger = createLogger(c.env);
    const start = Date.now();
    const { method, url } = c.req;

    logger.info('Request started', {
      method,
      url,
      userAgent: c.req.header('User-Agent'),
    });

    await next();

    const duration = Date.now() - start;
    const status = c.res.status;

    logger.info('Request completed', {
      method,
      url,
      status,
      duration: `${duration}ms`,
    });
  };
}
