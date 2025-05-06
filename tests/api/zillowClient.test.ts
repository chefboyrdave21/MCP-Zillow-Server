import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ZillowClient, APIError, RateLimitError, Logger } from '../../src/api/zillowClient';
import type { SearchParameters } from '../../src/models/search';

class TestLogger implements Logger {
  info(msg: string, meta?: any) { /* no-op */ }
  warn(msg: string, meta?: any) { /* no-op */ }
  error(msg: string, meta?: any) { /* no-op */ }
}

describe('ZillowClient', () => {
  let client: ZillowClient;
  let robotsHandler: any;
  let logger: Logger;

  beforeEach(() => {
    robotsHandler = {
      getCrawlDelay: jest.fn(() => Promise.resolve(1000))
    };
    logger = new TestLogger();
    client = new ZillowClient('https://api.zillow.com', robotsHandler, logger);
  });

  it('should return empty results for mock search', async () => {
    const params: SearchParameters = { location: 'San Francisco, CA' };
    const result = await client.search(params);
    expect(result).toEqual([]);
    expect(robotsHandler.getCrawlDelay).toHaveBeenCalled();
  });

  it('should retry on RateLimitError', async () => {
    let callCount = 0;
    // Patch the internal request function to throw RateLimitError once, then succeed
    const originalExecuteWithRetry = client['executeWithRetry'].bind(client);
    client['executeWithRetry'] = async function<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
      // Wrap the provided fn to simulate RateLimitError on first call
      let innerCallCount = 0;
      const wrappedFn = async () => {
        callCount++;
        if (callCount < 2) throw new RateLimitError('Rate limit', 10);
        return [] as any;
      };
      return originalExecuteWithRetry(wrappedFn, retries);
    };
    const params: SearchParameters = { location: 'San Francisco, CA' };
    const result = await client.search(params);
    expect(result).toEqual([]);
    expect(callCount).toBe(2);
  });

  it('should throw APIError on permanent failure', async () => {
    client['executeWithRetry'] = async function<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
      throw new APIError('Permanent error', 400, false);
    };
    const params: SearchParameters = { location: 'San Francisco, CA' };
    await expect(client.search(params)).rejects.toThrow(APIError);
  });
});
