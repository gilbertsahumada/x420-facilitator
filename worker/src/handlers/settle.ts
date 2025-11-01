import { Context } from "hono";
import { settle } from "x402/facilitator";
import {
  PaymentRequirementsSchema,
  PaymentPayloadSchema,
  createSigner,
  type X402Config,
} from "x402/types";
import type { Env, SettleResponse } from "@/types";
import { createLogger } from "@/utils/logger";
import { getRpcUrl, isNetworkSupported } from "@/utils/chains";

export async function settleHandler(
  c: Context<{ Bindings: Env }>
): Promise<Response> {
  const logger = createLogger(c.env);

  try {
    const body = await c.req.json();

    // Validate input
    const paymentPayload = PaymentPayloadSchema.parse(body.paymentPayload);
    const paymentRequirements = PaymentRequirementsSchema.parse(
      body.paymentRequirements
    );

    logger.info("Settling payment", {
      network: paymentRequirements.network,
      amount: paymentRequirements.asset,
    });

    // Check if network is supported
    if (!isNetworkSupported(paymentRequirements.network)) {
      logger.warn("Unsupported network for settlement", {
        network: paymentRequirements.network,
      });

      const response: SettleResponse = {
        success: false,
        error: `Unsupported network: ${paymentRequirements.network}. Supported: avalanche, avalanche-fuji`,
        timestamp: new Date().toISOString(),
      };

      return c.json(response, 400);
    }

    // Get RPC URL for the network
    const rpcUrl = getRpcUrl(paymentRequirements.network, c.env.ALCHEMY_API_KEY);

    // Create signer
    const signer = await createSigner(
      paymentRequirements.network,
      c.env.EVM_PRIVATE_KEY
    );

    // x402 config
    const x402Config: X402Config = {
      rpcUrl,
    } as X402Config;

    // Settle payment
    const result = await settle(
      signer,
      paymentPayload,
      paymentRequirements,
      x402Config
    );

    logger.info("Payment settlement completed", {
      success: result.success,
      transactionHash: result.transaction,
      network: paymentRequirements.network,
    });

    if (!result.success) {
      logger.warn("Payment settlement failed", {
        reason: result.errorReason,
        network: paymentRequirements.network,
      });

      const response: SettleResponse = {
        success: false,
        error: result.errorReason ? result.errorReason : undefined,
        timestamp: new Date().toISOString(),
      };

      return c.json(response, 400);
    }

    const response: SettleResponse = {
      success: result.success,
      transactionHash: result.transaction,
      network: paymentRequirements.network,
      error: result.errorReason ? result.errorReason : undefined,
      timestamp: new Date().toISOString(),
    };

    return c.json(response);
  } catch (error) {
    logger.error("Settlement failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error;
  }
}
