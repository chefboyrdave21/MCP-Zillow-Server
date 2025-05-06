import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { fetchWithUserAgent, DEFAULT_USER_AGENT } from '../utils/http';

jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import fetch from 'node-fetch';
const mockFetch = jest.mocked(fetch);

describe('fetchWithUserAgent', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('calls fetch with correct headers', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200, text: async () => 'ok' } as any);
    const url = 'https://example.com';
    await fetchWithUserAgent(url);
    expect(mockFetch).toHaveBeenCalledWith(url, expect.objectContaining({
      headers: expect.objectContaining({
        'User-Agent': DEFAULT_USER_AGENT,
        'Accept-Language': 'en-US,en;q=0.9',
      })
    }));
  });

  it('allows custom user agent', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200, text: async () => 'ok' } as any);
    const url = 'https://example.com';
    const customUA = 'CustomBot/2.0';
    await fetchWithUserAgent(url, customUA);
    expect(mockFetch).toHaveBeenCalledWith(url, expect.objectContaining({
      headers: expect.objectContaining({
        'User-Agent': customUA,
      })
    }));
  });

  it('propagates fetch errors', async () => {
    // Mock all retries to fail
    mockFetch.mockRejectedValue(new Error('Network error'));
    try {
      await fetchWithUserAgent('https://fail.com', DEFAULT_USER_AGENT, { retries: 3 });
      throw new Error('Expected fetchWithUserAgent to throw, but it resolved');
    } catch (err: any) {
      // Log the error for debugging
      // eslint-disable-next-line no-console
      console.error('[TEST] fetchWithUserAgent error:', err);
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/Network error/);
      // Check that fetch was called 3 times
      expect(mockFetch).toHaveBeenCalledTimes(3);
    }
  });
});
