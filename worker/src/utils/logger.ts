import type { Env, Logger, LogLevel } from '@/types';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export function createLogger(env: Env): Logger {
  const currentLevel = LOG_LEVELS[env.LOG_LEVEL] || LOG_LEVELS.info;

  const shouldLog = (level: LogLevel): boolean => {
    return LOG_LEVELS[level] >= currentLevel;
  };

  const log = (level: LogLevel, message: string, meta?: Record<string, unknown>) => {
    if (!shouldLog(level)) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      environment: env.ENVIRONMENT,
      message,
      ...meta,
    };

    // En Workers, console.log se envía a los logs de Cloudflare
    console.log(JSON.stringify(logEntry));
  };

  return {
    debug: (message, meta) => log('debug', message, meta),
    info: (message, meta) => log('info', message, meta),
    warn: (message, meta) => log('warn', message, meta),
    error: (message, meta) => log('error', message, meta),
  };
}
