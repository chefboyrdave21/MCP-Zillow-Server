import { describe, it, expect } from '@jest/globals';
import { mockFetch, createMockResponse } from '../setup.js';

// Example utility function to test
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('should format a number as USD currency', () => {
      expect(formatPrice(1234.56)).toBe('$1,234.56');
      expect(formatPrice(1000000)).toBe('$1,000,000.00');
      expect(formatPrice(0.99)).toBe('$0.99');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should handle negative numbers', () => {
      expect(formatPrice(-1234.56)).toBe('-$1,234.56');
    });
  });

  describe('fetchData', () => {
    beforeEach(() => {
      mockFetch.mockClear();
    });

    it('should fetch and parse JSON data successfully', async () => {
      const mockData = { key: 'value' };
      mockFetch.mockResolvedValueOnce(createMockResponse({ data: mockData }));

      const result = await fetchData('https://api.example.com/data');
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data');
      expect(result).toEqual(mockData);
    });

    it('should throw an error for non-ok responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ 
        ok: false, 
        status: 404 
      }));

      await expect(fetchData('https://api.example.com/notfound'))
        .rejects
        .toThrow('HTTP error! status: 404');
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/notfound');
    });
  });
}); 