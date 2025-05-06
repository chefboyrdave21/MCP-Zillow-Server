import { z } from 'zod';

/**
 * Zod schema for validating search parameters for the Zillow search tool.
 *
 * Fields:
 * - location: string (required)
 * - minPrice, maxPrice: number (optional, 0-100,000,000)
 * - minBeds, maxBeds, minBaths, maxBaths: number (optional, 0-20)
 * - propertyType: enum (optional)
 * - sortBy: enum (optional)
 * - page: number (default 1)
 * - pageSize: number (default 20)
 * - ignoreRobotsText: boolean (optional, for internal use)
 */
import { validateLocation } from './location';

export const searchParamsSchema = z.object({
  location: z.string()
    .min(1, "Location is required")
    .refine(
      (val) => validateLocation(val).isValid,
      (val) => ({ message: validateLocation(val).errorMessage || 'Invalid location format' })
    ),
  minPrice: z.coerce.number().min(0).max(100000000).optional(),
  maxPrice: z.coerce.number().min(0).max(100000000).optional(),
  minBeds: z.coerce.number().min(0).max(20).optional(),
  maxBeds: z.coerce.number().min(0).max(20).optional(),
  minBaths: z.coerce.number().min(0).max(20).optional(),
  maxBaths: z.coerce.number().min(0).max(20).optional(),
  propertyType: z.enum(["house", "apartment", "condo", "townhouse", "land"]).optional(),
  sortBy: z.enum(["price_asc", "price_desc", "date_listed", "relevance"]).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  ignoreRobotsText: z.boolean().optional()
});
