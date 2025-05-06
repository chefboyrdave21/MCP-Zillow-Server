/**
 * Builds a Zillow property details URL from a ZPID and optional parameters.
 *
 * Args:
 *   zpid (string | number): The Zillow Property ID.
 *   options (object): Optional flags (e.g., includePriceHistory, includeTaxHistory).
 *
 * Returns:
 *   string: The constructed Zillow property details URL.
 */
export interface PropertyUrlOptions {
  includePriceHistory?: boolean;
  includeTaxHistory?: boolean;
}

export function buildZillowPropertyUrl(zpid: string | number, options?: PropertyUrlOptions): string {
  if (!zpid || !/^\d+$/.test(String(zpid))) {
    throw new Error('Invalid ZPID: must be a non-empty numeric string or number');
  }
  const baseUrl = 'https://www.zillow.com/homedetails';
  let url = `${baseUrl}/${zpid}_zpid/`;

  // Optional params as query string (if Zillow supports them)
  const query: Record<string, string> = {};
  if (options?.includePriceHistory) query.priceHistory = '1';
  if (options?.includeTaxHistory) query.taxHistory = '1';

  const queryString = Object.keys(query).length
    ? '?' + Object.entries(query).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
    : '';

  return url + queryString;
}
