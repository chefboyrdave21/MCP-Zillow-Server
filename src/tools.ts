import type { Property, PropertyDetails } from './types.js';
import {
  ValidationError,
  RobotsDisallowedError,
  ToolError,
  formatError
} from './errors.js';

export const ZILLOW_SEARCH_TOOL = {
  name: 'zillow_search',
  description: 'Search for properties on Zillow based on specified criteria.',
  inputSchema: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'Location to search in (city, state, zip code, etc.)'
      },
      minPrice: {
        type: 'number',
        description: 'Minimum price filter'
      },
      maxPrice: {
        type: 'number',
        description: 'Maximum price filter'
      },
      beds: {
        type: 'number',
        description: 'Minimum number of bedrooms'
      },
      baths: {
        type: 'number',
        description: 'Minimum number of bathrooms'
      },
      propertyType: {
        type: 'string',
        description: 'Type of property (house, apartment, condo, etc.)'
      }
    },
    required: ['location']
  }
};

export const ZILLOW_PROPERTY_DETAILS_TOOL = {
  name: 'zillow_property_details',
  description: 'Get detailed information about a specific property on Zillow.',
  inputSchema: {
    type: 'object',
    properties: {
      zpid: {
        type: 'string',
        description: 'Zillow property ID'
      }
    },
    required: ['zpid']
  }
};

function validateParam(value: any, expectedType: string, paramName: string): void {
  if (value !== undefined && typeof value !== expectedType) {
    throw new ValidationError(`Invalid parameter type: ${paramName} must be a ${expectedType}`, { paramName, value });
  }
}

import type { SearchParameters, PropertySearchRequest } from './models/search.js';
import { RobotsHandler } from './utils/robots.js';
import { DEFAULT_USER_AGENT, fetchWithUserAgent } from './utils/http.js';

/**
 * Handles Zillow property search using validated parameters.
 * @param params PropertySearchRequest
 * @returns Array of Property results or error object
 */
export async function handleZillowSearch(params: PropertySearchRequest): Promise<any> {
  try {
    const { search, pagination } = params;
    const { location, minPrice, maxPrice, minBeds, maxBeds, minBaths, maxBaths, propertyType } = search;
    // Required parameter
    if (!location) {
      throw new ValidationError('Location is required for property search', { location });
    }
    validateParam(location, 'string', 'location');
    // Optional parameters
    validateParam(minPrice, 'number', 'minPrice');
    validateParam(maxPrice, 'number', 'maxPrice');
    validateParam(minBeds, 'number', 'minBeds');
    validateParam(maxBeds, 'number', 'maxBeds');
    validateParam(minBaths, 'number', 'minBaths');
    validateParam(maxBaths, 'number', 'maxBaths');
    validateParam(propertyType, 'string', 'propertyType');

    // --- Robots.txt compliance ---
    const BASE_URL = 'https://www.zillow.com';
    const robotsHandler = new RobotsHandler(BASE_URL, DEFAULT_USER_AGENT);
    await robotsHandler.fetchRobotsTxt();
    const searchPath = '/search'; // Adjust as needed for actual Zillow search endpoint
    const isAllowed = await robotsHandler.isPathAllowed(searchPath);
    if (!isAllowed) {
      throw new RobotsDisallowedError("This path is disallowed by Zillow's robots.txt to this User-agent. You may or may not want to run the server with '--ignore-robots-txt' args");
    }
    // Respect crawl-delay (handled by fetchWithUserAgent if passed robotsHandler)
    // TODO: Implement actual Zillow API call, passing robotsHandler to fetchWithUserAgent
    return {
      success: true,
      data: [],
      error: null
    };
  } catch (err: any) {
    // Log error
    console.error('[handleZillowSearch Error]', err);
    // Return formatted error response
    return formatError(err);
  }
}

import { handlePropertyDetails } from './tools/propertyDetails.js';

export const handleZillowPropertyDetails = handlePropertyDetails;
