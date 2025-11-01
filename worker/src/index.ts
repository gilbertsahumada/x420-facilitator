import { Hono } from 'hono';
import type { Env } from '@/types';
import { corsMiddleware } from '@/middleware/cors';
import { errorHandler } from '@/middleware/errorHandler';
import { loggerMiddleware } from '@/middleware/logger';
import { healthHandler } from '@/handlers/health';
import { supportedHandler } from '@/handlers/supported';
import { verifyHandler } from '@/handlers/verify';
import { settleHandler } from '@/handlers/settle';

const app = new Hono<{ Bindings: Env }>();

// Validate environment variables middleware
app.use('*', async (c, next) => {
  const requiredVars = ['EVM_PRIVATE_KEY', 'ALCHEMY_API_KEY'] as const;
  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!c.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    return c.json(
      {
        error: 'Configuration error',
        message: `Missing required environment variables: ${missing.join(', ')}`,
        help: 'Please configure secrets using: wrangler secret put <SECRET_NAME>',
      },
      500
    );
  }

  await next();
});

// Global middleware
app.use('*', corsMiddleware());
app.use('*', loggerMiddleware());

// Error handling
app.onError(errorHandler());

// Routes
app.get('/', (c) => {
  return c.json({
    name: 'x402 Payment Facilitator',
    version: '1.0.0',
    description: 'Cloudflare Workers implementation of x402 facilitator',
    endpoints: {
      health: 'GET /health',
      supported: 'GET /supported',
      verify: 'POST /verify',
      settle: 'POST /settle',
    },
    docs: 'https://x402.gitbook.io/x402',
  });
});

app.get('/health', healthHandler);
app.get('/supported', supportedHandler);
app.post('/verify', verifyHandler);
app.post('/settle', settleHandler);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

export default app;
