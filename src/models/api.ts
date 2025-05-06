/**
 * TypeScript interfaces for API responses and error handling
 */

import type { Property } from './property.js';
import type { PropertyDetails } from './property-details.js';
import type { PaginationMetadata } from './search.js';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  
  /** Response data (only present if success is true) */
  data?: T;
  
  /** Error information (only present if success is false) */
  error?: ErrorResponse;
  
  /** Response metadata including pagination if applicable */
  metadata?: ResponseMetadata;
  
  /** Response timestamp */
  timestamp: Date;
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  /** Pagination information if the response is paginated */
  pagination?: PaginationMetadata;
  
  /** Request ID for tracking */
  requestId: string;
  
  /** Server processing time in milliseconds */
  processingTime: number;
  
  /** Cache status (hit/miss) if applicable */
  cacheStatus?: 'HIT' | 'MISS';
}

/**
 * Base error response
 */
export interface ErrorResponse {
  /** Error code for client handling */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Additional error details */
  details?: string;
  
  /** Request ID for error tracking */
  requestId: string;
  
  /** Stack trace (only included in development) */
  stack?: string;
}

/**
 * Validation error response
 */
export interface ValidationError extends ErrorResponse {
  /** Field-specific validation errors */
  fieldErrors: {
    /** Field name as key, array of error messages as value */
    [field: string]: string[];
  };
}

/**
 * Rate limit error response
 */
export interface RateLimitError extends ErrorResponse {
  /** When the rate limit will reset */
  resetTime: Date;
  
  /** Number of seconds until reset */
  retryAfter: number;
  
  /** Current rate limit window */
  window: string;
}

/**
 * Property list response
 */
export interface PropertyListResponse extends ApiResponse<Property[]> {
  metadata: ResponseMetadata & {
    pagination: PaginationMetadata;
  };
}

/**
 * Property details response
 */
export interface PropertyDetailResponse extends ApiResponse<PropertyDetails> {
  metadata: ResponseMetadata;
}

/**
 * Error codes used in the API
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  PARSING_ERROR = 'PARSING_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
} 