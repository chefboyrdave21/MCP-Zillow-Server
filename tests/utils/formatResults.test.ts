import { describe, it, expect } from '@jest/globals';
import {
  mapApiResponseToProperty,
  filterProperties,
  sortProperties,
  paginateProperties,
  type FilterOptions,
  type SortKey,
} from '../../src/utils/formatResults';
import type { Property } from '../../src/types';

describe('formatResults utilities', () => {
  const raw = {
    zpid: '1',
    address: '123 Main St',
    price: 500000,
    beds: 3,
    baths: 2,
    sqft: 1500,
    propertyType: 'CONDO',
    yearBuilt: 2000,
    url: 'https://zillow.com/homedetails/1',
  };
  const property: Property = mapApiResponseToProperty(raw);
  const properties: Property[] = [
    property,
    { ...property, zpid: '2', price: 600000, beds: 4 },
    { ...property, zpid: '3', price: 400000, beds: 2, baths: 1 },
  ];

  it('maps raw API response to Property', () => {
    expect(property).toMatchObject({
      zpid: '1',
      address: '123 Main St',
      price: 500000,
      beds: 3,
      baths: 2,
      sqft: 1500,
      propertyType: 'CONDO',
      yearBuilt: 2000,
      url: 'https://zillow.com/homedetails/1',
    });
  });

  it('filters properties by price and beds', () => {
    const options: FilterOptions = { minPrice: 450000, maxBeds: 3 };
    const filtered = filterProperties(properties, options);
    expect(filtered.length).toBe(1);
    expect(filtered[0].zpid).toBe('1');
  });

  it('sorts properties by price descending', () => {
    const sorted = sortProperties(properties, 'price-desc');
    expect(sorted[0].price).toBe(600000);
    expect(sorted[2].price).toBe(400000);
  });

  it('paginates properties', () => {
    const paged = paginateProperties(properties, 2, 1);
    expect(paged.items.length).toBe(1);
    expect(paged.items[0].zpid).toBe('2');
    expect(paged.totalItems).toBe(3);
    expect(paged.currentPage).toBe(2);
    expect(paged.totalPages).toBe(3);
  });

  it('handles empty and edge cases', () => {
    expect(filterProperties([], {})).toEqual([]);
    expect(sortProperties([], 'price-asc')).toEqual([]);
    const paged = paginateProperties([], 1, 10);
    expect(paged.items).toEqual([]);
    expect(paged.totalItems).toBe(0);
    expect(paged.totalPages).toBe(1);
  });
});
