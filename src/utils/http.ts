/**
 * Performs a fetch request with a custom User-Agent, Accept-Language, timeout, retry, and optional robots.txt crawl delay.
 *
 * Args:
 *   url (string): The URL to fetch.
 *   userAgent (string): The User-Agent string to use (default: ModelContextProtocol/1.0).
 *   options (object):
 *     - timeout (number): Timeout in ms (default: 10000)
 *     - retries (number): Number of retry attempts (default: 3)
 *     - robotsHandler (RobotsHandler): Optional robots.txt handler for crawl delay
 *
 * Returns:
 *   Promise<Response>: The fetch response object.
 */
import fetch from 'node-fetch';
import type { RobotsHandler } from './robotsHandler.js';

export const DEFAULT_USER_AGENT = "ModelContextProtocol/1.0 (Autonomous; +https://github.com/modelcontextprotocol/servers)";

export async function fetchWithUserAgent(
  url: string,
  userAgent: string = DEFAULT_USER_AGENT,
  options?: {
    timeout?: number;
    retries?: number;
    robotsHandler?: RobotsHandler;
    robotsPath?: string;
  }
) {
  const timeout = options?.timeout ?? 10000;
  const retries = options?.retries ?? 3;
  const robotsHandler = options?.robotsHandler;
  const robotsPath = options?.robotsPath ?? url;

  // Respect robots.txt crawl delay if handler is provided
  if (robotsHandler) {
    await robotsHandler.getWaitTime();
  }

  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    // eslint-disable-next-line no-console
    console.log(`[fetchWithUserAgent] Attempt ${attempt + 1} of ${retries}`);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, {
        headers: {
          "User-Agent": userAgent,
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: controller.signal,
      });
      clearTimeout(timer);
      return response;
    } catch (err: any) {
      lastError = err;
      // Debug output for error propagation
      // eslint-disable-next-line no-console
      console.error(`[fetchWithUserAgent] Attempt ${attempt + 1} failed:`, err);
      // Exponential backoff
      await new Promise(res => setTimeout(res, 250 * Math.pow(2, attempt)));
    }
  }
  // Debug output before throwing last error
  // eslint-disable-next-line no-console
  console.error('[fetchWithUserAgent] All attempts failed, throwing lastError:', lastError);
  throw lastError;
}

/**
 * Formats an error into a standard response object.
 *
 * Args:
 *   err (unknown): The error to format.
 *   details (any): Optional extra details to include.
 *
 * Returns:
 *   { error: string, details?: any }
 */
export function formatError(err: unknown, details?: any) {
  if (err instanceof Error) {
    return { error: err.message, ...(details ? { details } : {}) };
  }
  return { error: String(err), ...(details ? { details } : {}) };
}
