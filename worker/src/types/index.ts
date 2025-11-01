export type Env = {
  // Secrets
  EVM_PRIVATE_KEY: string;
  ALCHEMY_API_KEY: string;
  ALLOWED_ORIGINS?: string;

  // Environment variables
  ENVIRONMENT: 'development' | 'staging' | 'production';
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';

  // KV Namespaces (opcional para rate limiting)
  // CACHE?: KVNamespace;
};

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export interface VerifyResponse {
  valid: boolean;
  reason?: string;
  timestamp: string;
}

export interface SettleResponse {
  success: boolean;
  transactionHash?: string;
  network?: string;
  error?: string;
  timestamp: string;
}

export interface SupportedScheme {
  scheme: string;
  network: string;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  environment: string;
  uptime?: number;
  rpc?: {
    connected: boolean;
    latestBlock?: string;
  };
}
