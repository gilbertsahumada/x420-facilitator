/**
 * Blockchain Networks Configuration
 *
 * Defines supported networks for the x402 facilitator.
 * Currently supporting Avalanche networks only.
 */

export interface ChainConfig {
  name: string;
  network: string; // x402 network identifier
  rpcUrl: (apiKey: string) => string;
  chainId: number;
  currency: string;
  blockExplorer: string;
  isTestnet: boolean;
}

/**
 * Supported chains configuration
 */
export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  'avalanche': {
    name: 'Avalanche C-Chain',
    network: 'avalanche',
    rpcUrl: (apiKey: string) => `https://avax-mainnet.g.alchemy.com/v2/${apiKey}`,
    chainId: 43114,
    currency: 'AVAX',
    blockExplorer: 'https://snowtrace.io',
    isTestnet: false,
  },
  'avalanche-fuji': {
    name: 'Avalanche Fuji Testnet',
    network: 'avalanche-fuji',
    rpcUrl: (apiKey: string) => `https://avax-fuji.g.alchemy.com/v2/${apiKey}`,
    chainId: 43113,
    currency: 'AVAX',
    blockExplorer: 'https://testnet.snowtrace.io',
    isTestnet: true,
  },
};

/**
 * Get list of supported network identifiers
 */
export function getSupportedNetworks(): string[] {
  return Object.keys(SUPPORTED_CHAINS);
}

/**
 * Get RPC URL for a specific network
 */
export function getRpcUrl(network: string, apiKey: string): string {
  const chain = SUPPORTED_CHAINS[network];

  if (!chain) {
    throw new Error(`Unsupported network: ${network}`);
  }

  return chain.rpcUrl(apiKey);
}

/**
 * Check if a network is supported
 */
export function isNetworkSupported(network: string): boolean {
  return network in SUPPORTED_CHAINS;
}
