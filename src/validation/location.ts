/**
 * Location validation and normalization utilities for Zillow search
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  normalized?: string;
}

const ZIP_CODE_REGEX = /^\d{5}(-\d{4})?$/;
const CITY_STATE_REGEX = /^([A-Za-z\s\-\.]+),\s*([A-Z]{2})$/;
// Accepts: 123 Main St, San Francisco, CA 94105 (zip optional)
const STREET_ADDRESS_REGEX = /^(\d+)\s+[A-Za-z0-9 .'-]+,\s*[A-Za-z .'-]+,\s*[A-Z]{2}(\s*\d{5})?$/;
const PO_BOX_REGEX = /^P\.?O\.? Box/i;
// Only allow US state codes (2 letters, not country codes)
const US_STATE_CODES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];
function isValidUSStateCode(code: string): boolean {
  return US_STATE_CODES.includes(code.toUpperCase());
}

const ERROR_MESSAGES = {
  INVALID_ZIP: 'Invalid ZIP code format. Must be 5 digits or 5+4 format (e.g., 12345 or 12345-6789).',
  INVALID_CITY_STATE: 'Invalid city/state format. Must be "City, ST" (e.g., "San Francisco, CA").',
  INVALID_STREET: 'Invalid street address format. Must be "123 Main St, City, ST 12345".',
  INTERNATIONAL_UNSUPPORTED: 'International locations are not supported by this API.',
  PO_BOX_UNSUPPORTED: 'P.O. Box addresses are not supported for property searches.',
  EMPTY_LOCATION: 'Location parameter cannot be empty.'
};

export function normalizeLocation(location: string): string {
  return location
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ', ')
    .replace(/\.$/, '')
    .replace(/\s+,/g, ',');
}

export function validateLocation(location: string): ValidationResult {
  const normalized = normalizeLocation(location);
  if (!normalized) {
    return { isValid: false, errorMessage: ERROR_MESSAGES.EMPTY_LOCATION };
  }
  if (PO_BOX_REGEX.test(normalized)) {
    return { isValid: false, errorMessage: ERROR_MESSAGES.PO_BOX_UNSUPPORTED };
  }
  // Check ZIP
  if (ZIP_CODE_REGEX.test(normalized)) {
    return { isValid: true, normalized };
  }
  // Check city, state
  const cityStateMatch = normalized.match(CITY_STATE_REGEX);
  if (cityStateMatch) {
    const state = cityStateMatch[2];
    if (!isValidUSStateCode(state)) {
      return { isValid: false, errorMessage: ERROR_MESSAGES.INTERNATIONAL_UNSUPPORTED };
    }
    return { isValid: true, normalized };
  }
  // Check street address
  const streetMatch = normalized.match(STREET_ADDRESS_REGEX);
  if (streetMatch) {
    // Extract state code from address
    const stateMatch = normalized.match(/,\s*([A-Z]{2})(\s*\d{5})?$/);
    if (!stateMatch || !isValidUSStateCode(stateMatch[1])) {
      return { isValid: false, errorMessage: ERROR_MESSAGES.INTERNATIONAL_UNSUPPORTED };
    }
    return { isValid: true, normalized };
  }
  return { isValid: false, errorMessage: 'Invalid location format.' };
}
