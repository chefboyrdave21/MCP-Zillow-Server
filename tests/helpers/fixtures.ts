import type { Property, PropertyDetails } from '../../src/types.js';

export function createMockProperty(): Property {
  return {
    zpid: '12345678',
    address: '123 Main St, Seattle, WA 98101',
    price: 750000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    propertyType: 'SINGLE_FAMILY',
    yearBuilt: 1985,
    url: 'https://www.zillow.com/homedetails/12345678'
  };
}

export function createMockPropertyDetails(): PropertyDetails {
  return {
    ...createMockProperty(),
    description: 'Beautiful 3-bedroom home in the heart of Seattle',
    features: ['Hardwood floors', 'Updated kitchen', 'Fenced yard'],
    schools: [
      {
        name: 'Roosevelt Elementary',
        rating: 8,
        distance: 0.5,
        type: 'Elementary'
      },
      {
        name: 'Hamilton Middle',
        rating: 7,
        distance: 1.2,
        type: 'Middle'
      },
      {
        name: 'Lincoln High',
        rating: 9,
        distance: 1.8,
        type: 'High'
      }
    ],
    taxHistory: [
      {
        year: 2023,
        amount: 680000
      }
    ],
    priceHistory: [
      {
        date: '2023-01-15',
        price: 725000,
        event: 'Listed for sale'
      },
      {
        date: '2022-06-30',
        price: 680000,
        event: 'Sold'
      }
    ]
  };
} 