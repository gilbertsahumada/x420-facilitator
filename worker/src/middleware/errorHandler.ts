import { Context } from 'hono';
import { ZodError } from 'zod';
import type { Env } from '@/types';
import { createLogger } from '@/utils/logger';

export function errorHandler() {
  return async (err: Error, c: Context<{ Bindings: Env }>) => {
    const logger = createLogger(c.env);

    // Zod validation errors
    if (err instanceof ZodError) {
      logger.warn('Validation error', {
        errors: err.errors,
        path: c.req.path,
      });

      return c.json(
        {
          error: 'Validation failed',
          details: err.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        400
      );
    }

    // Generic errors
    logger.error('Unhandled error', {
      error: err.message,
      stack: err.stack,
      path: c.req.path,
    });

    // Don't leak error details in production
    const isDevelopment = c.env.ENVIRONMENT === 'development';

    return c.json(
      {
        error: 'Internal server error',
        ...(isDevelopment && { details: err.message, stack: err.stack }),
      },
      500
    );
  };
}
