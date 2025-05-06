import { describe, it, expect } from '@jest/globals';
import { handlePropertyDetails } from '../tools/propertyDetails';

describe('handlePropertyDetails', () => {
  it('returns property details for valid zpid', async () => {
    const result = await handlePropertyDetails({ zpid: '123456' });
    expect(result).toHaveProperty('zpid', '123456');
    expect(result).toHaveProperty('address');
    expect(result).toHaveProperty('price');
  });

  it('returns error for missing zpid', async () => {
    const result = await handlePropertyDetails({});
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error).toMatch(/zpid/);
  });

  it('returns error for non-numeric zpid', async () => {
    const result = await handlePropertyDetails({ zpid: 'abc' });
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error).toMatch(/numeric/);
  });

  it('returns error for not found zpid', async () => {
    const result = await handlePropertyDetails({ zpid: '404' });
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error).toMatch(/not found/i);
  });
});
