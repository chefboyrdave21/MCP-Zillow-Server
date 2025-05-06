/**
 * Builds a Zillow search URL using validated search parameters.
 *
 * Supported fields (from searchParamsSchema):
 * - location: string (required)
 * - minPrice, maxPrice: number (optional)
 * - minBeds, maxBeds: number (optional)
 * - minBaths, maxBaths: number (optional)
 * - propertyType: enum (optional)
 * - sortBy: enum (optional)
 * - page: number (default 1)
 * - pageSize: number (default 20)
 *
 * Returns:
 *   string: Fully constructed Zillow search URL
 */
const SEARCH_API_URL = "https://www.zillow.com/search/GetSearchPageState.htm";

export async function buildSearchUrl(params: any): Promise<string> {
  const {
    location,
    minPrice,
    maxPrice,
    minBeds,
    maxBeds,
    minBaths,
    maxBaths,
    propertyType,
    sortBy,
    page = 1,
    pageSize = 20,
  } = params;

  // Zillow filterState mapping
  const filterState: Record<string, any> = {};
  if (minPrice !== undefined) filterState.price = { ...(filterState.price || {}), min: minPrice };
  if (maxPrice !== undefined) filterState.price = { ...(filterState.price || {}), max: maxPrice };
  if (minBeds !== undefined) filterState.beds = { ...(filterState.beds || {}), min: minBeds };
  if (maxBeds !== undefined) filterState.beds = { ...(filterState.beds || {}), max: maxBeds };
  if (minBaths !== undefined) filterState.baths = { ...(filterState.baths || {}), min: minBaths };
  if (maxBaths !== undefined) filterState.baths = { ...(filterState.baths || {}), max: maxBaths };
  if (propertyType !== undefined) filterState.homeType = [propertyType];
  if (sortBy !== undefined) filterState.sortSelection = { value: sortBy };

  const searchParams = new URLSearchParams({
    searchQueryState: JSON.stringify({
      pagination: { currentPage: page },
      usersSearchTerm: location,
      filterState,
      isMapVisible: false,
      mapBounds: {},
      regionSelection: [],
      category: 'cat1',
    }),
    wants: JSON.stringify({
      cat1: ["listResults"],
      cat2: ["total"],
    }),
    requestId: Math.floor(Math.random() * 1000000).toString(),
    pageSize: String(pageSize),
  });

  return `${SEARCH_API_URL}?${searchParams.toString()}`;
}
