import type { Config } from '../types.js';

export function loadConfig(): Config {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    logLevel: process.env.LOG_LEVEL || 'info',
    zillowApiKey: process.env.ZILLOW_API_KEY || '',
    robotsUrl: process.env.ROBOTS_URL
  };
}

export const config = loadConfig(); 