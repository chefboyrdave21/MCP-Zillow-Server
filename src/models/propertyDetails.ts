/**
 * Input parameters for Zillow property details tool
 */
export interface PropertyDetailsParams {
  /**
   * Zillow property ID (zpid)
   * - Must be a non-empty string (usually numeric)
   */
  zpid: string;
}

/**
 * Canonical property details response type
 * (extends Property with additional fields)
 */
export interface PropertyDetails {
  zpid: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  yearBuilt?: number;
  url: string;
  description?: string;
  photos?: string[];
  taxHistory?: TaxRecord[];
  priceHistory?: PriceRecord[];
  schools?: School[];
  features?: string[];
  lotSize?: number;
  parkingSpots?: number;
  hoaFee?: number;
}

export interface TaxRecord {
  year: number;
  taxAmount: number;
  assessedValue: number;
}

export interface PriceRecord {
  date: string; // ISO date string
  price: number;
  event: 'LISTED' | 'SOLD' | 'PRICE_CHANGE';
}

export interface School {
  name: string;
  type: 'ELEMENTARY' | 'MIDDLE' | 'HIGH';
  rating?: number; // 1-10
  distance: number; // miles
}
