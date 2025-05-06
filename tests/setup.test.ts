import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import fetch from 'node-fetch';
import { mockFetch, createMockResponse } from './setup.js';
import type { Response as NodeFetchResponse } from 'node-fetch';

jest.mock('node-fetch');

// Use a mock fetch type that returns node-fetch's Response
let fetchMock: jest.MockedFunction<(...args: any[]) => Promise<NodeFetchResponse>> = fetch as any;

describe('Test Setup', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('mockFetch returns default mock response', async () => {
    const mockResponse = createMockResponse({ ok: true, status: 200, data: { test: 'data' } });

    fetchMock.mockResolvedValueOnce(mockResponse);

    const response = await fetch('https://api.example.com/test');
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(data).toEqual({ test: 'data' });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://api.example.com/test');
  });

  test('mockFetch handles error responses', async () => {
    const mockResponse = createMockResponse({ ok: false, status: 429, statusText: 'Too Many Requests', data: { error: 'Rate limit exceeded' } });

    fetchMock.mockResolvedValueOnce(mockResponse);

    const response = await fetch('https://api.example.com/test');
    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(429);
    expect(response.statusText).toBe('Too Many Requests');
    expect(data).toEqual({ error: 'Rate limit exceeded' });
  });

  test('mockFetch includes Zillow-specific headers', async () => {
    const mockResponse = createMockResponse({ ok: true, status: 200, data: {} });

    fetchMock.mockResolvedValueOnce(mockResponse);

    const response = await fetch('https://api.example.com/test');
    
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('x-ratelimit-limit')).toBe('100');
    expect(response.headers.get('x-ratelimit-remaining')).toBe('99');
  });
}); 