import searchResponse from './responses/search.json' with { type: 'json' };
import propertyDetailsResponse from './responses/property-details.json' with { type: 'json' };

/**
 * Creates a mock search response with optional overrides
 */
export function createMockSearchResponse(overrides: Partial<typeof searchResponse> = {}) {
  return {
    ...searchResponse,
    ...overrides
  };
}

/**
 * Creates a mock property details response with optional overrides
 */
export function createMockPropertyDetailsResponse(overrides: Partial<typeof propertyDetailsResponse> = {}) {
  return {
    ...propertyDetailsResponse,
    ...overrides
  };
}

/**
 * Creates a mock error response from the Zillow API
 */
export function createMockErrorResponse(statusCode: number, message: string) {
  return {
    error: true,
    status: statusCode,
    message
  };
}

/**
 * Type definitions for Zillow API responses
 */
export type ZillowSearchResponse = typeof searchResponse;
export type ZillowPropertyDetailsResponse = typeof propertyDetailsResponse;
export type ZillowErrorResponse = {
  error: boolean;
  status: number;
  message: string;
}; 