import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';

// Import the schema from the main codebase
import { searchParamsSchema } from '../validation/searchParamsSchema';

describe('searchParamsSchema', () => {
  it('accepts valid parameters', () => {
    const params = {
      location: 'San Francisco, CA',
      minPrice: 100000,
      maxPrice: 500000,
      minBeds: 2,
      maxBeds: 4,
      minBaths: 1,
      maxBaths: 3,
      propertyType: 'house',
      sortBy: 'price_asc',
      page: 2,
      pageSize: 50,
      ignoreRobotsText: true
    };
    expect(() => searchParamsSchema.parse(params)).not.toThrow();
  });

  it('fails if location is missing', () => {
    const params = { minPrice: 100000 };
    expect(() => searchParamsSchema.parse(params)).toThrow();
  });

  it('fails for negative price', () => {
    const params = { location: '10001', minPrice: -1 };
    expect(() => searchParamsSchema.parse(params)).toThrow();
  });

  it('fails for too many beds', () => {
    const params = { location: '10001', minBeds: 100 };
    expect(() => searchParamsSchema.parse(params)).toThrow();
  });

  it('fails for invalid propertyType', () => {
    const params = { location: '10001', propertyType: 'castle' };
    expect(() => searchParamsSchema.parse(params)).toThrow();
  });

  it('coerces string numbers', () => {
    const params = { location: '10001', minPrice: '100000', page: '2' };
    const result = searchParamsSchema.parse(params);
    expect(result.minPrice).toBe(100000);
    expect(result.page).toBe(2);
  });

  it('applies default values', () => {
    const params = { location: '10001' };
    const result = searchParamsSchema.parse(params);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it('allows extra fields (ignoreRobotsText)', () => {
    const params = { location: '10001', ignoreRobotsText: true };
    expect(() => searchParamsSchema.parse(params)).not.toThrow();
  });
});
