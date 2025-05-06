import * as cheerio from 'cheerio';

export interface PropertyDetails {
  zpid: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  url: string;
  description: string;
  yearBuilt: number;
  lotSize: number;
  parking: string;
  heating: string;
  cooling: string;
  images: string[];
}

/**
 * Parses Zillow property details from HTML.
 *
 * Args:
 *   html (string): The HTML content of the property page.
 *   baseUrl (string): The base URL for constructing the property URL.
 *
 * Returns:
 *   PropertyDetails: The extracted property details object.
 *
 * Throws:
 *   Error if parsing fails or data is missing.
 */
export function parsePropertyDetails(html: string, baseUrl: string): PropertyDetails {
  const $ = cheerio.load(html);
  const scriptData = $('script[data-zrr-shared-data-key="mobileSearchPageStore"]').html() || '';
  let propertyData: any;
  try {
    propertyData = JSON.parse(scriptData.replace(/^\s*<!--\s*|\s*-->\s*$/g, ''));
  } catch {
    throw new Error('Failed to parse property data');
  }
  if (!propertyData?.property) {
    throw new Error('Invalid property data format');
  }
  const property = propertyData.property;
  return {
    zpid: property.zpid,
    address: property.address?.streetAddress || 'Address not available',
    price: property.price || 0,
    beds: property.bedrooms || 0,
    baths: property.bathrooms || 0,
    sqft: property.livingArea || 0,
    type: property.homeType || 'Not specified',
    url: `${baseUrl}/homedetails/${property.zpid}_zpid/`,
    description: property.description || 'No description available',
    yearBuilt: property.yearBuilt || 0,
    lotSize: property.lotSize || 0,
    parking: property.parkingFeatures?.join(', ') || 'Not specified',
    heating: property.heatingFeatures?.join(', ') || 'Not specified',
    cooling: property.coolingFeatures?.join(', ') || 'Not specified',
    images: (property.photos || []).map((photo: any) => photo.url),
  };
}
