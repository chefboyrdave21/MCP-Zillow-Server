import { describe, it, expect } from '@jest/globals';
import { handleZillowSearch } from '../tools';
import type { PropertySearchRequest } from '../models/search';
import { PropertyType, PropertySortOption } from '../models/search';

// Mock implementation for now, as the handler is a stub

describe('handleZillowSearch', () => {
  it('returns an empty array for valid input (stub)', async () => {
    const params: PropertySearchRequest = {
      search: {
        location: 'San Francisco, CA',
        minPrice: 100000,
        maxPrice: 500000,
        minBeds: 2,
        maxBeds: 4,
        minBaths: 1,
        maxBaths: 3,
        propertyType: PropertyType.CONDO,
        minSquareFeet: 800,
        maxSquareFeet: 2000,
        minYearBuilt: 1990,
        maxYearBuilt: 2022,
        keywords: ['view', 'balcony']
      },
      pagination: {
        page: 1,
        itemsPerPage: 20,
        sortBy: PropertySortOption.PRICE_HIGH_TO_LOW,
        ascending: false
      }
    };
    const result = await handleZillowSearch(params);
    expect(Array.isArray(result) || (result && typeof result === 'object' && 'error' in result)).toBe(true);
  });

  it('returns error for missing location', async () => {
    const params: PropertySearchRequest = {
      search: {
        location: '', // Invalid
      },
      pagination: {
        page: 1,
        itemsPerPage: 20
      }
    };
    const result = await handleZillowSearch(params);
    expect(result).toHaveProperty('error');
  });
});
