import { Context } from 'hono';
import { verify } from 'x402/facilitator';
import {
  PaymentRequirementsSchema,
  PaymentPayloadSchema,
  createConnectedClient,
  type X402Config,
} from 'x402/types';
import type { Env, VerifyResponse } from '@/types';
import { createLogger } from '@/utils/logger';
import { getRpcUrl, isNetworkSupported } from '@/utils/chains';

export async function verifyHandler(c: Context<{ Bindings: Env }>): Promise<Response> {
  const logger = createLogger(c.env);

  try {
    const body = await c.req.json();

    // Validate input
    const paymentPayload = PaymentPayloadSchema.parse(body.paymentPayload);
    const paymentRequirements = PaymentRequirementsSchema.parse(body.paymentRequirements);

    console.log('**************************************************');
    logger.info('Verifying payment', {
      network: paymentRequirements.network,
      amount: paymentRequirements.payTo,
    });
    console.log('**************************************************');

    // Check if network is supported
    if (!isNetworkSupported(paymentRequirements.network)) {
      console.log('**************************************************');
      logger.warn('Unsupported network', { network: paymentRequirements.network });
      console.log('**************************************************');

      const response: VerifyResponse = {
        valid: false,
        reason: `Unsupported network: ${paymentRequirements.network}. Supported: avalanche, avalanche-fuji`,
        timestamp: new Date().toISOString(),
      };

      return c.json(response, 400);
    }

    // Get RPC URL for the network
    const rpcUrl = getRpcUrl(paymentRequirements.network, c.env.ALCHEMY_API_KEY);

    // Create client
    const client = createConnectedClient(paymentRequirements.network);

    // x402 config
    const x402Config: X402Config = {
      rpcUrl,
    } as X402Config;

    // Verify payment
    const result = await verify(client, paymentPayload, paymentRequirements, x402Config);

    if (!result.isValid) {
      console.log('**************************************************');
      logger.warn('Payment verification failed', {
        reason: result.invalidReason,
        network: paymentRequirements.network,
      });
    }

    logger.info('Payment verification completed', {
      valid: result.isValid,
      network: paymentRequirements.network,
    });

    return c.json(result);
  } catch (error) {
    logger.error('Verification failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error;
  }
}
