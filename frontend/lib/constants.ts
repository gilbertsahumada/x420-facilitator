/**
 * Central constants file for the frontend application
 * All constants should be exported from here
 */

// Facilitator address from environment variable
export const FACILITATOR_ADDRESS = (process.env.NEXT_PUBLIC_FACILITATOR_ADDRESS || "0x76b0d7aa45c0efeec787d3a661247fbe19416885") as `0x${string}`;

// Facilitator API URL
export const FACILITATOR_URL = process.env.NEXT_PUBLIC_FACILITATOR_URL || "https://facilitator.x420.cloud";

// Supported blockchain networks
export const NETWORKS = [
  {
    name: 'Avalanche',
    color: '#E84142',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    chainId: 43114,
    enabled: false,
  },
  {
    name: 'Avalanche Fuji',
    color: '#E84142',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    chainId: 43113,
    enabled: true,
  }
] as const;

// Supported chains for dashboard (mapped format)
export const SUPPORTED_CHAINS = [
  { 
    id: "avalanche", 
    name: "Avalanche", 
    symbol: "AVAX", 
    color: "#E84142", 
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc", 
    enabled: false 
  },
  { 
    id: "avalanche-fuji", 
    name: "Avalanche Fuji", 
    symbol: "AVAX", 
    color: "#E84142", 
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc", 
    enabled: true 
  },
] as const;

