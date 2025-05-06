import { ValidatedSearchParams } from '../models/search';

/**
 * Builds a Zillow search URL from validated search parameters.
 *
 * Args:
 *   params (ValidatedSearchParams): The validated search parameters.
 *
 * Returns:
 *   string: The constructed Zillow search URL.
 */
export function buildZillowSearchUrl(params: ValidatedSearchParams): string {
  const baseUrl = 'https://www.zillow.com/homes';
  const locationSegment = buildLocationSegment(params);
  const filterSegments = buildFilterSegments(params);
  const queryParams = buildQueryParams(params);

  return `${baseUrl}/${locationSegment}${filterSegments}${queryParams ? `?${queryParams}` : ''}`;
}

function buildLocationSegment(params: ValidatedSearchParams): string {
  if (params.zip) {
    return `${params.zip}_rb`;
  } else if (params.city && params.state) {
    return `${params.city.toLowerCase().replace(/\s+/g, '-')}-${params.state.toLowerCase()}_rb`;
  } else {
    throw new Error('Invalid location parameters: requires either zip code or city+state combination');
  }
}

function buildFilterSegments(params: ValidatedSearchParams): string {
  let segments = '';
  if (params.minPrice || params.maxPrice) {
    segments += `/${params.minPrice ?? ''}_${params.maxPrice ?? ''}_price`;
  }
  if (params.minBeds || params.maxBeds) {
    segments += `/${params.minBeds ?? ''}-${params.maxBeds ?? ''}_beds`;
  }
  if (params.propertyType) {
    segments += `/${params.propertyType}_type`;
  }
  // Add more filters as needed
  return segments;
}

function buildQueryParams(params: ValidatedSearchParams): string {
  const query: Record<string, string> = {};
  if (params.sort) {
    query['sort'] = params.sort;
  }
  if (params.page) {
    query['pagination'] = encodeURIComponent(JSON.stringify({ currentPage: params.page }));
  }
  // Add more query params as needed
  return Object.entries(query)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}
