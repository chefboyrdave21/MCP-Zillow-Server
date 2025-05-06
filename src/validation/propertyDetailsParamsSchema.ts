import { z } from 'zod';
import type { PropertyDetailsParams } from '../models/propertyDetails';

/**
 * Zod schema for validating PropertyDetailsParams
 * - zpid: required, non-empty string, numeric string allowed
 */
export const propertyDetailsParamsSchema = z.object({
  zpid: z.string().min(1, 'zpid is required').regex(/^\d+$/, 'zpid must be a numeric string'),
});

// Type-level test: ensure z.infer<typeof propertyDetailsParamsSchema> matches PropertyDetailsParams
export type PropertyDetailsParamsFromSchema = z.infer<typeof propertyDetailsParamsSchema>;
// If you use tsd or a type-checker, PropertyDetailsParamsFromSchema should be assignable to PropertyDetailsParams
