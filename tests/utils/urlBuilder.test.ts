import { buildZillowSearchUrl } from '../../src/utils/urlBuilder';

describe('buildZillowSearchUrl', () => {
  it('builds URL for city/state', () => {
    const params = {
      city: 'Miami',
      state: 'FL',
      minPrice: 500000,
      maxPrice: 1000000,
      minBeds: 2,
      maxBeds: 4,
      propertyType: 'house',
      sort: 'pricea',
      page: 2
    };
    const url = buildZillowSearchUrl(params as any);
    expect(url).toContain('miami-fl_rb');
    expect(url).toContain('/500000_1000000_price');
    expect(url).toContain('/2-4_beds');
    expect(url).toContain('/house_type');
    expect(url).toContain('sort=pricea');
    expect(url).toContain('pagination=');
  });

  it('builds URL for zip code', () => {
    const params = {
      zip: '90210',
      minPrice: 750000,
      maxPrice: 2000000,
      minBeds: 3,
      propertyType: 'condo',
      sort: 'days',
      page: 1
    };
    const url = buildZillowSearchUrl(params as any);
    expect(url).toContain('90210_rb');
    expect(url).toContain('/750000_2000000_price');
    expect(url).toContain('/3-_beds');
    expect(url).toContain('/condo_type');
    expect(url).toContain('sort=days');
  });

  it('throws for missing location', () => {
    const params = {
      minPrice: 100000
    };
    expect(() => buildZillowSearchUrl(params as any)).toThrow('Invalid location parameters');
  });

  it('encodes special characters in city/state', () => {
    const params = {
      city: 'San José',
      state: 'CA',
      minPrice: 300000
    };
    const url = buildZillowSearchUrl(params as any);
    expect(url).toContain('san-josé-ca_rb');
  });

  it('handles missing optional params', () => {
    const params = {
      city: 'Austin',
      state: 'TX'
    };
    const url = buildZillowSearchUrl(params as any);
    expect(url).toContain('austin-tx_rb');
  });
});
