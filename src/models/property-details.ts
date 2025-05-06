/**
 * TypeScript interfaces for detailed property information
 */

import type { Property } from './property.js';

/**
 * Types of price history events
 */
export enum PriceHistoryEventType {
  LISTED = 'LISTED',
  PRICE_CHANGE = 'PRICE_CHANGE',
  PENDING = 'PENDING',
  SOLD = 'SOLD',
  LISTING_REMOVED = 'LISTING_REMOVED',
}

/**
 * Single entry in a property's price history
 */
export interface PriceHistoryEntry {
  /** Date of the price change/event */
  date: Date;

  /** Price amount in dollars */
  price: number;

  /** Price change amount (can be negative) */
  priceChange?: number;

  /** Price change as a percentage (can be negative) */
  priceChangePercent?: number;

  /** Type of event that caused the price change */
  eventType: PriceHistoryEventType;

  /** Additional details about the event */
  eventDescription?: string;

  /** Source of the price information (e.g., MLS, Zillow) */
  source?: string;
}

/**
 * Complete price history for a property
 */
export interface PriceHistory {
  /** Array of price history entries, sorted by date descending */
  entries: PriceHistoryEntry[];

  /** Highest recorded price */
  highestPrice: number;

  /** Lowest recorded price */
  lowestPrice: number;

  /** Average days between price changes */
  averageDaysBetweenChanges?: number;

  /** Total number of price changes */
  totalPriceChanges: number;

  /** Last updated timestamp */
  lastUpdated: Date;
}

/**
 * Single entry in a property's tax history
 */
export interface TaxHistoryEntry {
  /** Tax year */
  year: number;

  /** Tax amount paid in dollars */
  taxAmount: number;

  /** Assessed property value */
  assessedValue: number;

  /** Date of assessment */
  assessmentDate: Date;

  /** Tax rate as a percentage */
  taxRate?: number;

  /** Additional tax details or notes */
  details?: string;
}

/**
 * Complete tax history for a property
 */
export interface TaxHistory {
  /** Array of tax history entries, sorted by year descending */
  entries: TaxHistoryEntry[];

  /** Highest assessed value */
  highestAssessedValue: number;

  /** Lowest assessed value */
  lowestAssessedValue: number;

  /** Average annual tax amount */
  averageAnnualTax: number;

  /** Last updated timestamp */
  lastUpdated: Date;
}

/**
 * Additional property details not included in basic info
 */
export interface ExtendedPropertyDetails {
  /** Heating system type */
  heatingType?: string;

  /** Cooling system type */
  coolingType?: string;

  /** Appliances included */
  appliances?: string[];

  /** Interior features */
  interiorFeatures?: string[];

  /** Exterior features */
  exteriorFeatures?: string[];

  /** Construction materials */
  construction?: string[];

  /** Roof type */
  roofType?: string;

  /** Foundation type */
  foundationType?: string;

  /** Parking details */
  parkingDetails?: string;

  /** Utility information */
  utilities?: string[];

  /** HOA information if applicable */
  hoa?: {
    fee?: number;
    frequency?: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
    includes?: string[];
  };
}

/**
 * Complete property details including history
 */
export interface PropertyDetails extends Property {
  /** Price history information */
  priceHistory: PriceHistory;

  /** Tax history information */
  taxHistory: TaxHistory;

  /** Extended property details */
  extendedDetails: ExtendedPropertyDetails;

  /** School information */
  schools?: {
    elementary?: string;
    middle?: string;
    high?: string;
    ratings?: {
      [key: string]: number;
    };
  };

  /** Walk score if available */
  walkScore?: number;

  /** Transit score if available */
  transitScore?: number;

  /** Bike score if available */
  bikeScore?: number;

  /** Public records information */
  publicRecords?: {
    parcelNumber?: string;
    lastSaleDate?: Date;
    lastSalePrice?: number;
    deedType?: string;
  };
}
