import express from 'express';
import { searchParamsSchema } from '../validation/searchParamsSchema';
import type { Request, Response, NextFunction } from 'express';
import { PropertyType, PropertySortOption } from '../models/search';

const router = express.Router();

// Validation middleware
function validateSearchParams(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = searchParamsSchema.parse(req.query);
    (req as any).validatedParams = validated;
    next();
  } catch (error: any) {
    res.status(400).json({
      error: 'Invalid search parameters',
      details: error.errors || error.message,
    });
  }
}

/**
 * GET /api/search
 * Query params: location, minPrice, maxPrice, minBeds, maxBeds, minBaths, maxBaths, propertyType, minSquareFeet, maxSquareFeet, minYearBuilt, maxYearBuilt, keywords, sortBy, ascending, page, itemsPerPage
 */
router.get('/', validateSearchParams, async (req: Request, res: Response) => {
  // For now, just return the validated params as a stub
  const params = (req as any).validatedParams;
  res.status(200).json({
    message: 'Validated search parameters',
    params,
  });
});

export default router;
