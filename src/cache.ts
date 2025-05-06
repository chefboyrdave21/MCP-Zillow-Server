import NodeCache from 'node-cache';

/**
 * Simple in-memory cache wrapper for MCP server tools.
 * Supports TTL, get, set, del, and clear operations, with logging.
 */
export interface CacheOptions {
  stdTTL?: number; // default TTL in seconds
  checkperiod?: number; // check expired keys interval in seconds
}

export class Cache {
  private cache: NodeCache;

  constructor(options?: CacheOptions) {
    this.cache = new NodeCache({
      stdTTL: options?.stdTTL || 600, // default 10 min
      checkperiod: options?.checkperiod || 120,
      useClones: false,
    });
  }

  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);
    if (value !== undefined) {
      console.log(`[CACHE] HIT: ${key}`);
    } else {
      console.log(`[CACHE] MISS: ${key}`);
    }
    return value;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, value, ttl);
    console.log(`[CACHE] SET: ${key} (ttl=${ttl || this.cache.options.stdTTL})`);
  }

  del(key: string): void {
    this.cache.del(key);
    console.log(`[CACHE] DEL: ${key}`);
  }

  clear(): void {
    this.cache.flushAll();
    console.log('[CACHE] CLEAR ALL');
  }
}

/**
 * Utility to generate a cache key from an object (e.g., request params).
 * Ensures stable key by sorting object keys.
 */
export function generateCacheKey(obj: Record<string, any>): string {
  const sorted = Object.keys(obj)
    .sort()
    .map((k) => `${k}:${JSON.stringify(obj[k])}`)
    .join('|');
  return sorted;
}
