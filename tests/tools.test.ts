import { describe, test, expect } from '@jest/globals';
import { ZILLOW_SEARCH_TOOL, ZILLOW_PROPERTY_DETAILS_TOOL, handleZillowSearch, handleZillowPropertyDetails } from '../src/tools';
import type { Property, PropertyDetails } from '../src/types';

describe('Tools', () => {
  describe('ZILLOW_SEARCH_TOOL', () => {
    test('has correct name and description', () => {
      expect(ZILLOW_SEARCH_TOOL.name).toBe('zillow_search');
      expect(ZILLOW_SEARCH_TOOL.description).toBeDefined();
    });

    test('requires location parameter', () => {
      expect(ZILLOW_SEARCH_TOOL.inputSchema.required).toContain('location');
    });

    test('returns empty array for valid location', async () => {
      const result = await handleZillowSearch({ location: 'San Francisco, CA' });
      if (Array.isArray(result)) {
        expect(result.length).toBe(0);
      } else {
        throw new Error('Expected result to be an array');
      }
    });

    test('returns error object when location is missing', async () => {
      const result = await handleZillowSearch({});
      if ('error' in result) {
        expect(result.error).toMatch(/location is required/i);
      } else {
        throw new Error('Expected error object');
      }
    });

    test('returns error object when location is not a string', async () => {
      const result = await handleZillowSearch({ location: 123 });
      if ('error' in result) {
        expect(result.error).toMatch(/location must be a string/i);
      } else {
        throw new Error('Expected error object');
      }
    });

    test('returns error object for invalid optional parameter types', async () => {
      const result = await handleZillowSearch({ 
        location: 'San Francisco, CA',
        minPrice: 'invalid',
        beds: 'invalid',
        propertyType: 123
      });
      if ('error' in result) {
        expect(result.error).toBeDefined();
      } else {
        throw new Error('Expected error object');
      }
    });
  });

  describe('ZILLOW_PROPERTY_DETAILS_TOOL', () => {
    test('has correct name and description', () => {
      expect(ZILLOW_PROPERTY_DETAILS_TOOL.name).toBe('zillow_property_details');
      expect(ZILLOW_PROPERTY_DETAILS_TOOL.description).toBeDefined();
    });

    test('requires zpid parameter', () => {
      expect(ZILLOW_PROPERTY_DETAILS_TOOL.inputSchema.required).toContain('zpid');
    });

    test('returns null for valid zpid', async () => {
      const result = await handleZillowPropertyDetails({ zpid: '1234567' });
      expect(result).toBeNull();
    });

    test('returns error object when zpid is missing', async () => {
      const result = await handleZillowPropertyDetails({});
      if (result && typeof result === 'object' && 'error' in result) {
        expect(result.error).toContain('Zillow property ID (zpid) is required');
      } else {
        throw new Error('Expected error object');
      }
    });

    test('returns error object when zpid is not a string', async () => {
      const result = await handleZillowPropertyDetails({ zpid: 123456 });
      if (result && typeof result === 'object' && 'error' in result) {
        expect(result.error).toMatch(/zpid must be a string/i);
      } else {
        throw new Error('Expected error object');
      }
    });
  });
});