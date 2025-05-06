import { buildZillowPropertyUrl } from '../../src/utils/propertyUrlBuilder';

describe('buildZillowPropertyUrl', () => {
  it('builds URL for valid ZPID', () => {
    const url = buildZillowPropertyUrl('12345678');
    expect(url).toBe('https://www.zillow.com/homedetails/12345678_zpid/');
  });

  it('builds URL for numeric ZPID', () => {
    const url = buildZillowPropertyUrl(987654321);
    expect(url).toBe('https://www.zillow.com/homedetails/987654321_zpid/');
  });

  it('adds priceHistory and taxHistory query params', () => {
    const url = buildZillowPropertyUrl('12345678', { includePriceHistory: true, includeTaxHistory: true });
    expect(url).toBe('https://www.zillow.com/homedetails/12345678_zpid/?priceHistory=1&taxHistory=1');
  });

  it('throws for missing ZPID', () => {
    expect(() => buildZillowPropertyUrl('')).toThrow('Invalid ZPID');
    expect(() => buildZillowPropertyUrl(undefined as any)).toThrow('Invalid ZPID');
  });

  it('throws for non-numeric ZPID', () => {
    expect(() => buildZillowPropertyUrl('abc123')).toThrow('Invalid ZPID');
  });
});
