const fs = require('fs');
const path = require('path');
// const { describe, it, expect } = require('@jest/globals');
const { parsePropertyDetails } = require('../utils/parsePropertyDetails');

const BASE_URL = 'https://www.zillow.com';

function loadFixture(name: string) {
  return fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf-8');
}

describe('parsePropertyDetails', () => {
  it('parses all fields from valid HTML', () => {
    const html = loadFixture('property-full.html');
    const details = parsePropertyDetails(html, BASE_URL);
    expect(details.zpid).toBeDefined();
    expect(typeof details.address).toBe('string');
    expect(details.address.length).toBeGreaterThan(0);
    expect(details.price).toBeGreaterThan(0);
    expect(details.beds).toBeGreaterThanOrEqual(0);
    expect(details.baths).toBeGreaterThanOrEqual(0);
    expect(details.sqft).toBeGreaterThanOrEqual(0);
    expect(details.type).toBeDefined();
    expect(details.url).toMatch(/^https:\/\//);
    expect(details.description).toBeDefined();
    expect(details.yearBuilt).toBeGreaterThanOrEqual(0);
    expect(details.lotSize).toBeGreaterThanOrEqual(0);
    expect(details.parking).toBeDefined();
    expect(details.heating).toBeDefined();
    expect(details.cooling).toBeDefined();
    expect(Array.isArray(details.images)).toBe(true);
  });

  it('handles missing/partial data', () => {
    const html = loadFixture('property-partial.html');
    const details = parsePropertyDetails(html, BASE_URL);
    expect(details.address).toBeDefined();
    expect(details.price).toBeGreaterThanOrEqual(0);
    // Should not throw for missing optional fields
  });

  it('throws on malformed or empty HTML', () => {
    expect(() => parsePropertyDetails('', BASE_URL)).toThrow();
    expect(() => parsePropertyDetails('<html></html>', BASE_URL)).toThrow();
  });
});
