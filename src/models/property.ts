/**
 * TypeScript interfaces for basic property data models
 */

/**
 * Property location information
 */
export interface PropertyLocation {
  /** Full street address */
  streetAddress: string;
  
  /** Unit number if applicable */
  unit?: string;
  
  /** City name */
  city: string;
  
  /** State code (e.g., CA, NY) */
  state: string;
  
  /** ZIP code */
  zipCode: string;
  
  /** Neighborhood name */
  neighborhood?: string;
  
  /** Latitude coordinate */
  latitude: number;
  
  /** Longitude coordinate */
  longitude: number;
  
  /** County name */
  county?: string;
}

/**
 * Property media (images, videos, etc.)
 */
export interface PropertyMedia {
  /** Main/featured image URL */
  mainImageUrl: string;
  
  /** Additional image URLs */
  imageUrls: string[];
  
  /** Virtual tour URL if available */
  virtualTourUrl?: string;
  
  /** Video tour URL if available */
  videoUrl?: string;
  
  /** Floor plan image URL if available */
  floorPlanUrl?: string;
}

/**
 * Property listing information
 */
export interface PropertyListingInfo {
  /** Zillow property ID */
  zpid: string;
  
  /** MLS number if available */
  mlsNumber?: string;
  
  /** Date the property was listed */
  listingDate: Date;
  
  /** Current listing status */
  status: 'FOR_SALE' | 'PENDING' | 'SOLD' | 'OFF_MARKET';
  
  /** Days on Zillow */
  daysOnZillow: number;
  
  /** Listing agent name */
  agentName?: string;
  
  /** Listing office name */
  officeName?: string;
  
  /** Agent phone number */
  agentPhone?: string;
  
  /** Agent email */
  agentEmail?: string;
}

/**
 * Basic property information
 */
export interface PropertyBasicInfo {
  /** Current price in dollars */
  price: number;
  
  /** Number of bedrooms */
  bedrooms: number;
  
  /** Number of bathrooms */
  bathrooms: number;
  
  /** Square footage of living area */
  squareFeet: number;
  
  /** Lot size in square feet */
  lotSize?: number;
  
  /** Year the property was built */
  yearBuilt: number;
  
  /** Property type */
  propertyType: string;
  
  /** Number of stories */
  stories?: number;
  
  /** Whether property has a garage */
  hasGarage?: boolean;
  
  /** Number of parking spaces */
  parkingSpaces?: number;
  
  /** Whether property has a pool */
  hasPool?: boolean;
  
  /** Property description */
  description?: string;
  
  /** Key features/amenities */
  features: string[];
}

/**
 * Complete property model combining all basic information
 */
export interface Property {
  /** Property location details */
  location: PropertyLocation;
  
  /** Property media content */
  media: PropertyMedia;
  
  /** Listing information */
  listing: PropertyListingInfo;
  
  /** Basic property details */
  details: PropertyBasicInfo;
  
  /** URL to the property on Zillow */
  zillowUrl: string;
  
  /** Last updated timestamp */
  lastUpdated: Date;
} 