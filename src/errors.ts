/**
 * Custom error classes and error formatting utility for MCP tools.
 */

export class ValidationError extends Error {
  code = 'validation_error';
  details?: any;
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class NotFoundError extends Error {
  code = 'not_found';
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends Error {
  code = 'rate_limit';
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ParsingError extends Error {
  code = 'parsing_error';
  details?: any;
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ParsingError';
    this.details = details;
  }
}

export class RobotsDisallowedError extends Error {
  code = 'robots_disallowed';
  constructor(message: string) {
    super(message);
    this.name = 'RobotsDisallowedError';
  }
}

export class ToolError extends Error {
  code = 'tool_error';
  details?: any;
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ToolError';
    this.details = details;
  }
}

/**
 * Formats an error into a standard response object.
 */
export function formatError(err: any) {
  return {
    success: false,
    error: {
      code: err.code || 'unknown_error',
      message: err.message || 'An unknown error occurred',
      details: err.details || undefined,
    },
    data: null,
  };
}
