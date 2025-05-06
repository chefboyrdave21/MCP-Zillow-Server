/**
 * TypeScript interfaces for search parameters and pagination
 */

/**
 * Property types available for search
 */
export enum PropertyType {
  SINGLE_FAMILY = 'SINGLE_FAMILY',
  MULTI_FAMILY = 'MULTI_FAMILY',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  LAND = 'LAND',
  OTHER = 'OTHER',
}

/**
 * Sort options for property search results
 */
export enum PropertySortOption {
  NEWEST = 'NEWEST',
  PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
  PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
  BEDS = 'BEDS',
  BATHS = 'BATHS',
  SQUARE_FEET = 'SQUARE_FEET',
}

/**
 * Search parameters for property queries
 */
/**
 * Search parameters for property queries (runtime validated by searchParamsSchema)
 */
export interface SearchParameters {
  /** Location string (city, state, zip, neighborhood, etc.) */
  location: string;
  
  /** Minimum price in dollars */
  minPrice?: number;
  
  /** Maximum price in dollars */
  maxPrice?: number;
  
  /** Minimum number of bedrooms */
  minBeds?: number;
  
  /** Maximum number of bedrooms */
  maxBeds?: number;
  
  /** Minimum number of bathrooms */
  minBaths?: number;
  
  /** Maximum number of bathrooms */
  maxBaths?: number;
  
  /** Type of property to search for */
  propertyType?: PropertyType;
  
  /** Minimum square footage */
  minSquareFeet?: number;
  
  /** Maximum square footage */
  maxSquareFeet?: number;
  
  /** Year built - minimum */
  minYearBuilt?: number;
  
  /** Year built - maximum */
  maxYearBuilt?: number;
  
  /** Keywords to search in the listing description */
  keywords?: string[];
}

/**
 * Parameters for paginating search results
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page: number;
  
  /** Number of items per page */
  itemsPerPage: number;
  
  /** Sort option for results */
  sortBy?: PropertySortOption;
  
  /** Whether to sort in ascending order */
  ascending?: boolean;
}

/**
 * Metadata about pagination in responses
 */
export interface PaginationMetadata {
  /** Total number of items across all pages */
  totalItems: number;
  
  /** Total number of pages */
  totalPages: number;
  
  /** Current page number */
  currentPage: number;
  
  /** Number of items per page */
  itemsPerPage: number;
  
  /** Whether there is a next page */
  hasNextPage: boolean;
  
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
}

/**
 * Combined search request parameters
 */
/**
 * Combined search request parameters (criteria + pagination)
 */
export interface PropertySearchRequest {
  /** Search criteria */
  search: SearchParameters;
  
  /** Pagination parameters */
  pagination: PaginationParams;
} 