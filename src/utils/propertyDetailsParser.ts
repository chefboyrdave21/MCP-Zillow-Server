import * as cheerio from 'cheerio';

/**
 * Parses Zillow property details HTML and extracts structured property information.
 *
 * Args:
 *   html (string): The HTML content of the property details page.
 *
 * Returns:
 *   PropertyDetails: The extracted property details object.
 */
export interface PropertyDetails {
  zpid: string;
  address: string;
  price: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  lotSize?: string;
  yearBuilt?: string;
  propertyType?: string;
  description?: string;
  features?: string[];
  priceHistory?: Array<Record<string, any>>;
  taxHistory?: Array<Record<string, any>>;
  photos?: string[];
  virtualTours?: string[];
}

export function parsePropertyDetails(html: string): PropertyDetails {
  if (!html || typeof html !== 'string') {
    throw new Error('Invalid HTML input');
  }
  const $ = cheerio.load(html);

  // Example selectors (update as needed for real Zillow HTML)
  const address = $('[data-testid="home-details-summary-headline"]').text().trim();
  const price = $('[data-testid="price"]').text().trim();
  const beds = $('[data-testid="bed-bath-beyond-bedroom"]').text().trim();
  const baths = $('[data-testid="bed-bath-beyond-bathroom"]').text().trim();
  const sqft = $('[data-testid="bed-bath-beyond-floorSpace"]').text().trim();
  const lotSize = $('[data-testid="bed-bath-beyond-lotSize"]').text().trim();
  const yearBuilt = $('[data-testid="year-built-value"]').text().trim();
  const propertyType = $('[data-testid="home-type-chip"]').text().trim();
  const description = $('[data-testid="home-description-text"]').text().trim();
  const features = $('[data-testid="feature-list-item"]').map((_, el) => $(el).text().trim()).get();

  // Price history and tax history (example: parse tables)
  const priceHistory: Array<Record<string, any>> = [];
  $('[data-testid="price-history-table"] tr').each((_, row) => {
    const cells = $(row).find('td').map((_, td) => $(td).text().trim()).get();
    if (cells.length) priceHistory.push({ cells });
  });

  const taxHistory: Array<Record<string, any>> = [];
  $('[data-testid="tax-history-table"] tr').each((_, row) => {
    const cells = $(row).find('td').map((_, td) => $(td).text().trim()).get();
    if (cells.length) taxHistory.push({ cells });
  });

  // Photos and virtual tours (example: parse img/video tags)
  const photos = $('[data-testid="media-stream-photo"] img').map((_, el) => $(el).attr('src')).get();
  const virtualTours = $('[data-testid="virtual-tour-link"]').map((_, el) => $(el).attr('href')).get();

  // ZPID extraction (example: from meta tag or URL)
  const zpid = $('meta[property="zillow:zpid"]').attr('content') || '';

  return {
    zpid,
    address,
    price,
    beds,
    baths,
    sqft,
    lotSize,
    yearBuilt,
    propertyType,
    description,
    features,
    priceHistory,
    taxHistory,
    photos,
    virtualTours
  };
}
