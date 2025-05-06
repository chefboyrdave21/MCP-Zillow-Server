import {
  ValidationError,
  NotFoundError,
  RateLimitError,
  ParsingError,
  RobotsDisallowedError,
  ToolError,
  formatError
} from '../src/errors';

describe('Custom Error Classes', () => {
  it('ValidationError sets code and details', () => {
    const err = new ValidationError('Invalid input', { field: 'location' });
    expect(err.code).toBe('validation_error');
    expect(err.details).toEqual({ field: 'location' });
  });

  it('NotFoundError sets code', () => {
    const err = new NotFoundError('Not found');
    expect(err.code).toBe('not_found');
  });

  it('RateLimitError sets code', () => {
    const err = new RateLimitError('Too many requests');
    expect(err.code).toBe('rate_limit');
  });

  it('ParsingError sets code and details', () => {
    const err = new ParsingError('Parse fail', { html: '<bad>' });
    expect(err.code).toBe('parsing_error');
    expect(err.details).toEqual({ html: '<bad>' });
  });

  it('RobotsDisallowedError sets code', () => {
    const err = new RobotsDisallowedError('Blocked by robots.txt');
    expect(err.code).toBe('robots_disallowed');
  });

  it('ToolError sets code and details', () => {
    const err = new ToolError('Generic tool error', { foo: 'bar' });
    expect(err.code).toBe('tool_error');
    expect(err.details).toEqual({ foo: 'bar' });
  });
});

describe('formatError', () => {
  it('formats known error types', () => {
    const err = new ValidationError('Invalid', { field: 'x' });
    const formatted = formatError(err);
    expect(formatted.success).toBe(false);
    expect(formatted.error.code).toBe('validation_error');
    expect(formatted.error.message).toBe('Invalid');
    expect(formatted.error.details).toEqual({ field: 'x' });
    expect(formatted.data).toBeNull();
  });

  it('formats unknown error types', () => {
    const err = new Error('Oops');
    const formatted = formatError(err);
    expect(formatted.error.code).toBe('unknown_error');
    expect(formatted.error.message).toBe('Oops');
    expect(formatted.error.details).toBeUndefined();
  });
});
