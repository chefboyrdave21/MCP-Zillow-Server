import type { PropertyDetailsParams, PropertyDetails } from '../models/propertyDetails';

/**
 * APIError for simulating API failures
 */
export class APIError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

/**
 * Mock implementation for fetching property details by zpid
 * Replace with real API integration as needed
 */
export async function fetchPropertyDetails(params: PropertyDetailsParams): Promise<PropertyDetails> {
  // Simulate a property details lookup
  if (params.zpid === '404') {
    throw new APIError('Property not found', 404);
  }
  if (!/^[0-9]+$/.test(params.zpid)) {
    throw new APIError('Invalid zpid format', 400);
  }
  // Return mock data
  return {
    zpid: params.zpid,
    address: '123 Main St, San Francisco, CA 94105',
    price: 1200000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    propertyType: 'CONDO',
    yearBuilt: 2005,
    url: `https://zillow.com/homedetails/${params.zpid}`,
    description: 'Beautiful condo in downtown SF.',
    photos: ['https://zillow.com/photo1.jpg'],
    taxHistory: [
      { year: 2023, taxAmount: 12000, assessedValue: 1100000 },
      { year: 2022, taxAmount: 11500, assessedValue: 1050000 }
    ],
    priceHistory: [
      { date: '2024-01-01', price: 1200000, event: 'LISTED' },
      { date: '2022-06-01', price: 1100000, event: 'SOLD' }
    ],
    schools: [
      { name: 'Downtown Elementary', type: 'ELEMENTARY', rating: 9, distance: 0.5 },
      { name: 'Central High', type: 'HIGH', rating: 8, distance: 1.2 }
    ],
    features: ['Balcony', 'Garage', 'Pool'],
    lotSize: 2000,
    parkingSpots: 2,
    hoaFee: 500
  };
}
