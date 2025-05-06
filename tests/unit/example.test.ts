import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { mockFetch, createMockResponse } from '../setup.js';

describe('Example Unit Test', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockFetch.mockClear();
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  it('should demonstrate a successful test', () => {
    expect(true).toBe(true);
  });

  it('should demonstrate mocking fetch', async () => {
    const mockData = { success: true, data: 'test' };
    mockFetch.mockResolvedValueOnce(createMockResponse({ data: mockData }));

    const response = await fetch('https://api.example.com/test');
    const data = await response.json();

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test');
    expect(data).toEqual(mockData);
  });

  it('should demonstrate error handling', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetch('https://api.example.com/test'))
      .rejects
      .toThrow('Network error');
  });
}); 