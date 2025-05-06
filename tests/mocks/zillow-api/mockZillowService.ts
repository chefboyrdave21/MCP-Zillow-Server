import type { ZillowSearchResult, ZillowPropertyDetails, Property, PropertyDetails } from '../../../src/types.js';
import type { ZillowSearchResponse } from './mockFactory.js';
import { createMockSearchResponse, createMockPropertyDetailsResponse, createMockErrorResponse } from './mockFactory.js';

export interface MockZillowServiceOptions {
  shouldFail?: boolean;
  errorMessage?: string;
  errorStatus?: number;
  searchDelay?: number;
  detailsDelay?: number;
}

export class MockZillowService {
  private options: MockZillowServiceOptions;

  constructor(options: MockZillowServiceOptions = {}) {
    this.options = {
      shouldFail: false,
      errorMessage: 'An error occurred',
      errorStatus: 500,
      searchDelay: 0,
      detailsDelay: 0,
      ...options
    };
  }

  async searchProperties(params: ZillowSearchResult): Promise<Property[]> {
    if (this.options.searchDelay) {
      await new Promise(resolve => setTimeout(resolve, this.options.searchDelay));
    }

    if (this.options.shouldFail) {
      throw createMockErrorResponse(
        this.options.errorStatus!,
        this.options.errorMessage!
      );
    }

    const response = createMockSearchResponse();
    return response.results.map((property: ZillowSearchResponse['results'][0]) => ({
      zpid: property.zpid,
      address: property.address,
      price: property.price,
      beds: property.beds,
      baths: property.baths,
      sqft: property.sqft,
      propertyType: property.propertyType,
      yearBuilt: property.yearBuilt,
      url: property.url
    }));
  }

  async getPropertyDetails(params: ZillowPropertyDetails): Promise<PropertyDetails> {
    if (this.options.detailsDelay) {
      await new Promise(resolve => setTimeout(resolve, this.options.detailsDelay));
    }

    if (this.options.shouldFail) {
      throw createMockErrorResponse(
        this.options.errorStatus!,
        this.options.errorMessage!
      );
    }

    const response = createMockPropertyDetailsResponse();
    return {
      zpid: response.zpid,
      address: `${response.address.streetAddress}, ${response.address.city}, ${response.address.state} ${response.address.zipcode}`,
      price: response.price,
      beds: response.bedrooms,
      baths: response.bathrooms,
      sqft: response.livingArea,
      propertyType: response.propertyType,
      yearBuilt: response.yearBuilt,
      url: response.url,
      description: response.description,
      features: [
        response.features.hasGarage ? 'Garage' : null,
        response.features.hasCentralAir ? 'Central Air' : null,
        response.features.hasFireplace ? 'Fireplace' : null
      ].filter(Boolean) as string[],
      schools: response.schools,
      taxHistory: [{
        year: response.taxAssessment.year,
        amount: response.taxAssessment.amount
      }],
      priceHistory: [] // Not included in mock response for simplicity
    };
  }
} 