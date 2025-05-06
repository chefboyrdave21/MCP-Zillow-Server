import type { PropertyDetailsParams } from '../models/propertyDetails';
import { propertyDetailsParamsSchema } from '../validation/propertyDetailsParamsSchema';
import { fetchPropertyDetails } from '../api/zillowClient';
import type { PropertyDetails } from '../models/propertyDetails';
import { ValidationError, NotFoundError, formatError } from '../errors';

/**
 * Handler for the Zillow property details tool
 * @param params - PropertyDetailsParams
 * @returns PropertyDetails or error object
 */
export async function handlePropertyDetails(params: unknown): Promise<PropertyDetails | { error: string; code?: string; details?: any }> {
  try {
    // Validate input
    let parsed: PropertyDetailsParams;
    try {
      parsed = propertyDetailsParamsSchema.parse(params) as PropertyDetailsParams;
    } catch (zodErr: any) {
      throw new ValidationError(zodErr.message, zodErr.errors);
    }
    // Fetch property details (mock or real)
    try {
      return await fetchPropertyDetails(parsed);
    } catch (apiErr: any) {
      if (apiErr.statusCode === 404) throw new NotFoundError(apiErr.message, apiErr);
      throw apiErr;
    }
  } catch (err: any) {
    return formatError(err);
  }
}
