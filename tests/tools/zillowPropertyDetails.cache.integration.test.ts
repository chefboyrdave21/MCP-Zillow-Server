import { zillowPropertyDetailsTool } from '../../src/tools/zillowPropertyDetails';

jest.useFakeTimers();

describe('zillowPropertyDetailsTool (caching)', () => {
  it('returns cached result for identical requests', async () => {
    const result1 = await zillowPropertyDetailsTool('12345678');
    const result2 = await zillowPropertyDetailsTool('12345678');
    expect(result1).toBe(result2); // Should be the same object (from cache)
  });

  it('returns different results for different ZPIDs', async () => {
    const result1 = await zillowPropertyDetailsTool('12345678');
    const result2 = await zillowPropertyDetailsTool('87654321');
    expect(result1).not.toBe(result2);
  });

  it('expires cache after TTL', async () => {
    const result1 = await zillowPropertyDetailsTool('12345678');
    jest.advanceTimersByTime(1800 * 1000 + 100); // 30 min + 100ms
    const result2 = await zillowPropertyDetailsTool('12345678');
    expect(result1).not.toBe(result2); // Should be a new object after expiry
  });
});
