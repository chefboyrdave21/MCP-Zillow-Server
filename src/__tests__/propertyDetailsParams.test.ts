import { describe, it, expect } from '@jest/globals';
import { propertyDetailsParamsSchema } from '../validation/propertyDetailsParamsSchema';

describe('propertyDetailsParamsSchema', () => {
  it('accepts valid zpid', () => {
    expect(() => propertyDetailsParamsSchema.parse({ zpid: '123456' })).not.toThrow();
  });

  it('rejects empty zpid', () => {
    expect(() => propertyDetailsParamsSchema.parse({ zpid: '' })).toThrow(/zpid is required/);
  });

  it('rejects non-numeric zpid', () => {
    expect(() => propertyDetailsParamsSchema.parse({ zpid: 'abc' })).toThrow(/numeric/);
    expect(() => propertyDetailsParamsSchema.parse({ zpid: '123abc' })).toThrow(/numeric/);
  });

  it('rejects missing zpid', () => {
    expect(() => propertyDetailsParamsSchema.parse({} as any)).toThrow(/zpid/);
  });
});
