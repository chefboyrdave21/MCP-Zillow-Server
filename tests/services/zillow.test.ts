import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { ZillowService } from '../../src/services/zillow.js';
import { createMockResponse } from '../setup.js';
import type { Response as NodeFetchResponse } from 'node-fetch';

describe('ZillowService', () => {
  let service: ZillowService;
  let mockFetch: jest.MockedFunction<(...args: any[]) => Promise<NodeFetchResponse>>;

  beforeEach(() => {
    // Reset mocks before each test
    mockFetch = jest.fn() as jest.MockedFunction<(...args: any[]) => Promise<NodeFetchResponse>>;
    global.fetch = mockFetch as any;
    service = new ZillowService('test-api-key');
  });

  describe('searchProperties', () => {
    test('returns parsed search results for valid location', async () => {
      const mockSearchResponse = {
        results: [
          {
            zpid: '123',
            address: {
              streetAddress: '123 Main St',
              city: 'San Francisco',
              state: 'CA',
              zipcode: '94105'
            },
            price: 500000,
            livingArea: 1500,
            bedrooms: 3,
            bathrooms: 2
          }
        ],
        totalResults: 1
      };

      mockFetch.mockResolvedValue(createMockResponse(mockSearchResponse));

      const result = await service.searchProperties('San Francisco, CA');

      expect(result).toEqual([
        {
          zpid: '123',
          address: '123 Main St, San Francisco, CA 94105',
          price: 500000,
          sqft: 1500,
          bedrooms: 3,
          bathrooms: 2
        }
      ]);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/properties?location=San%20Francisco%2C%20CA'),
        expect.any(Object)
      );
    });

    test('handles empty search results', async () => {
      mockFetch.mockResolvedValue(createMockResponse({ results: [], totalResults: 0 }));

      const result = await service.searchProperties('NonExistent Location');

      expect(result).toEqual([]);
    });

    test('throws error for failed API request', async () => {
      mockFetch.mockResolvedValue(createMockResponse('', { ok: false, status: 400, statusText: 'Bad Request' }));

      await expect(service.searchProperties('')).rejects.toThrow('API request failed: Bad Request');
    });

    test('throws error for invalid API response', async () => {
      mockFetch.mockResolvedValue(createMockResponse({ invalid: 'response' }));

      await expect(service.searchProperties('San Francisco, CA')).rejects.toThrow('Invalid API response format');
    });
  });

  describe('getPropertyDetails', () => {
    test('returns parsed property details for valid zpid', async () => {
      const mockDetailsResponse = {
        zpid: '123',
        address: {
          streetAddress: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipcode: '94105'
        },
        price: 500000,
        livingArea: 1500,
        bedrooms: 3,
        bathrooms: 2,
        yearBuilt: 1990,
        lotSize: 5000,
        description: 'Beautiful home'
      };

      mockFetch.mockResolvedValue(createMockResponse(mockDetailsResponse));

      const result = await service.getPropertyDetails('123');

      expect(result).toEqual({
        zpid: '123',
        address: '123 Main St, San Francisco, CA 94105',
        price: 500000,
        sqft: 1500,
        bedrooms: 3,
        bathrooms: 2,
        yearBuilt: 1990,
        lotSize: 5000,
        description: 'Beautiful home'
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/properties/123'),
        expect.any(Object)
      );
    });

    test('throws error for non-existent property', async () => {
      mockFetch.mockResolvedValue(createMockResponse('', { ok: false, status: 404, statusText: 'Not Found' }));

      await expect(service.getPropertyDetails('invalid')).rejects.toThrow('API request failed: Not Found');
    });

    test('throws error for invalid API response', async () => {
      mockFetch.mockResolvedValue(createMockResponse({ invalid: 'response' }));

      await expect(service.getPropertyDetails('123')).rejects.toThrow('Invalid API response format');
    });
  });
}); 