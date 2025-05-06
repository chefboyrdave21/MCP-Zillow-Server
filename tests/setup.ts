// Import Jest types
import type { Config } from '@jest/types';
import { jest } from '@jest/globals';
import type { Response as NodeFetchResponse, HeadersInit, RequestInfo, RequestInit } from 'node-fetch';
import { Response as NodeFetchResponseClass, Headers as NodeFetchHeaders } from 'node-fetch';
import type { MockInstance } from 'jest-mock';

// Set timeout for API calls
jest.setTimeout(10000);

// Create a mock response with default values
export function createMockResponse(
  body: any = null,
  options: Partial<NodeFetchResponse> & { headers?: HeadersInit } = {}
): NodeFetchResponse {
  const headers = new NodeFetchHeaders(options.headers || { 'content-type': 'application/json' });
  const responseBody = typeof body === 'string' ? body : JSON.stringify(body);
  return new NodeFetchResponseClass(responseBody, {
    status: options.status ?? 200,
    statusText: options.statusText ?? 'OK',
    headers,
    ...options,
  });
}

// Define the fetch function type
export type FetchFn = (url: RequestInfo, init?: RequestInit) => Promise<NodeFetchResponse>;

// Create a properly typed mock fetch function
export const mockFetch = jest.fn(
  async (_url: RequestInfo, _init?: RequestInit): Promise<NodeFetchResponse> =>
    createMockResponse()
) as jest.MockedFunction<FetchFn>;

// Set up test environment
beforeAll(() => {
  // Set up global test environment
  (global as any).fetch = mockFetch;
  process.env.NODE_ENV = 'test';
  process.env.ZILLOW_API_KEY = 'test-api-key';
});

afterAll(() => {
  // Clean up global test environment
  delete (global as any).fetch;
  delete process.env.ZILLOW_API_KEY;
  delete process.env.NODE_ENV;
});

afterEach(() => {
  // Reset all mocks after each test
  jest.clearAllMocks();
  mockFetch.mockReset();
  jest.resetModules();
  process.env = { ...process.env, NODE_ENV: 'test' };
}); 