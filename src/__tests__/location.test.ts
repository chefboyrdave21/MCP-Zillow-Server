import { describe, test, expect } from '@jest/globals';
import { validateLocation } from '../validation/location';

describe('Location Validation', () => {
  test.each([
    ['123 Main St, San Francisco, CA 94105', true],
    ['San Francisco, CA', true],
    ['94105', true],
    ['94105-1234', true],
    ['', false],
    ['123', false],
    ['Invalid Location!', false],
    ['P.O. Box 123, San Francisco, CA', false],
    ['London, UK', false]
  ])('validates %s as %s', (input, expected) => {
    expect(validateLocation(input).isValid).toBe(expected);
  });

  test('returns descriptive error messages', () => {
    expect(validateLocation('').errorMessage).toMatch(/cannot be empty/i);
    expect(validateLocation('P.O. Box 123, San Francisco, CA').errorMessage).toMatch(/P\.O\. Box/i);
    expect(validateLocation('London, UK').errorMessage).toMatch(/international/i);
  });

  test('normalizes location strings', () => {
    const result = validateLocation('  123   Main St ,  San Francisco , CA 94105.  ');
    expect(result.normalized).toBe('123 Main St, San Francisco, CA 94105');
  });
});
