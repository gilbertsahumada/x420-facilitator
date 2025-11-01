import { Context } from 'hono';
import { getSupportedNetworks } from '@/utils/chains';
import type { Env, SupportedScheme } from '@/types';

export async function supportedHandler(c: Context<{ Bindings: Env }>): Promise<Response> {
  const networks = getSupportedNetworks();

  const schemes: SupportedScheme[] = networks.map((network) => ({
    scheme: 'erc3009',
    network: network,
  }));

  return c.json({
    version: '1.0.0',
    facilitator: 'x402-facilitator-cloudflare',
    networks: networks,
    schemes,
  });
}
