import { describe, it, expect } from '@jest/globals';
import { buildSearchUrl } from '../utils/buildSearchUrl';

// Helper to parse query params from the URL
function getQueryParams(url: string) {
  const query = url.split('?')[1];
  return Object.fromEntries(new URLSearchParams(query));
}

describe('buildSearchUrl', () => {
  it('builds a URL with all supported fields', async () => {
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
    };
    const url = await buildSearchUrl(params);
    const qp = getQueryParams(url);
    const state = JSON.parse(qp.searchQueryState);
    expect(state.usersSearchTerm).toBe('San Francisco, CA');
    expect(state.pagination.currentPage).toBe(2);
    expect(state.filterState.price.min).toBe(100000);
    expect(state.filterState.price.max).toBe(500000);
    expect(state.filterState.beds.min).toBe(2);
    expect(state.filterState.beds.max).toBe(4);
    expect(state.filterState.baths.min).toBe(1);
    expect(state.filterState.baths.max).toBe(3);
    expect(state.filterState.homeType).toEqual(['house']);
    expect(state.filterState.sortSelection.value).toBe('price_asc');
    expect(qp.pageSize).toBe('50');
  });

  it('builds a URL with only required fields', async () => {
    const params = { location: 'NYC' };
    const url = await buildSearchUrl(params);
    const qp = getQueryParams(url);
    const state = JSON.parse(qp.searchQueryState);
    expect(state.usersSearchTerm).toBe('NYC');
    expect(state.pagination.currentPage).toBe(1);
    expect(qp.pageSize).toBe('20');
  });

  it('handles edge case: min > max', async () => {
    const params = {
      location: 'LA',
      minPrice: 600000,
      maxPrice: 500000,
      minBeds: 5,
      maxBeds: 2,
    };
    const url = await buildSearchUrl(params);
    const qp = getQueryParams(url);
    const state = JSON.parse(qp.searchQueryState);
    expect(state.filterState.price.min).toBe(600000);
    expect(state.filterState.price.max).toBe(500000);
    expect(state.filterState.beds.min).toBe(5);
    expect(state.filterState.beds.max).toBe(2);
  });

  it('omits filters not provided', async () => {
    const params = { location: 'Boston', minBeds: 2 };
    const url = await buildSearchUrl(params);
    const qp = getQueryParams(url);
    const state = JSON.parse(qp.searchQueryState);
    expect(state.filterState.beds.min).toBe(2);
    expect(state.filterState.price).toBeUndefined();
    expect(state.filterState.baths).toBeUndefined();
  });
});
