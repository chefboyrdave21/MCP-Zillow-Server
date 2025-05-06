export interface ZillowSearchResult {
  location: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
}

export interface ZillowPropertyDetails {
  zpid: string;
}

export interface School {
  name: string;
  rating: number;
  distance: number;
  type: string;
}

export interface TaxHistory {
  year: number;
  amount: number;
}

export interface PriceHistory {
  date: string;
  price: number;
  event: string;
}

/**
 * Canonical Property type for Zillow search results (see models/property.ts for full model)
 */
export interface Property {
  zpid: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  yearBuilt: number;
  url: string;
}

export interface PropertyDetails extends Property {
  description: string;
  features: string[];
  schools: School[];
  taxHistory: TaxHistory[];
  priceHistory: PriceHistory[];
}

export interface Config {
  port: number;
  logLevel: string;
  zillowApiKey: string;
  robotsUrl?: string;
}