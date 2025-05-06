import { buildZillowPropertyUrl } from '../utils/propertyUrlBuilder.js';
import type { PropertyUrlOptions } from '../utils/propertyUrlBuilder.js';
import { parsePropertyDetails } from '../utils/propertyDetailsParser.js';
import { Cache, generateCacheKey } from '../cache.js';
import {
  ValidationError,
  ParsingError,
  RobotsDisallowedError,
  ToolError,
  formatError
} from '../errors.js';
// import { httpClient } from '../api/httpClient.js'; // Assume httpClient is implemented elsewhere
// import { RobotsHandler } from '../utils/robots.js'; // Assume RobotsHandler is implemented elsewhere

const propertyDetailsCache = new Cache({ stdTTL: 1800 }); // 30 min default TTL

/**
 * Fetches and parses Zillow property details for a given ZPID, with caching and robust error handling.
 *
 * Args:
 *   zpid (string | number): The Zillow Property ID.
 *   options (PropertyUrlOptions): Optional flags for price/tax history.
 *
 * Returns:
 *   Promise<{success: boolean, data: any, error: any}>: The parsed property details object or error response.
 */
export async function zillowPropertyDetailsTool(
  zpid: string | number,
  options?: PropertyUrlOptions
) {
  try {
    // 1. Validate ZPID
    if (!zpid || !/^\d+$/.test(String(zpid))) {
      throw new ValidationError('Invalid ZPID: must be a non-empty numeric string or number', { zpid });
    }

    // 2. Generate cache key
    const cacheKey = generateCacheKey({ zpid, ...options });
    const cached = propertyDetailsCache.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    // 3. Build property details URL
    const url = buildZillowPropertyUrl(zpid, options);

    // 4. Check robots.txt compliance (pseudo-code)
    // const robots = new RobotsHandler('https://www.zillow.com', 'YourBot/1.0');
    // const allowed = await robots.isPathAllowed(new URL(url).pathname);
    // if (!allowed) throw new RobotsDisallowedError('Access to this URL is disallowed by robots.txt');

    // 5. Fetch property details HTML (pseudo-code)
    // const response = await httpClient.get(url);
    // if (!response.ok) throw new ToolError('Failed to fetch property details', { url });
    // const html = response.data;
    const html = '<html><!-- mock HTML for testing --></html>'; // Replace with real fetch

    // 6. Parse HTML
    let details;
    try {
      details = parsePropertyDetails(html);
    } catch (err: any) {
      throw new ParsingError('Failed to parse property details HTML', { message: err.message });
    }

    // 7. Prepare response and cache it
    const result = {
      success: true,
      data: details,
      error: null
    };
    propertyDetailsCache.set(cacheKey, result);
    return result;
  } catch (err: any) {
    // Log error
    console.error('[PropertyDetailsTool Error]', err);
    // Return formatted error response
    return formatError(err);
  }
}
