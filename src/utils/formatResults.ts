import type { Property } from '../types';

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  maxBaths?: number;
  propertyType?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export function mapApiResponseToProperty(raw: any): Property {
  // Map raw API/mock data to canonical Property type
  return {
    zpid: raw.zpid || '',
    address: raw.address || '',
    price: raw.price || 0,
    beds: raw.beds || 0,
    baths: raw.baths || 0,
    sqft: raw.sqft || 0,
    propertyType: raw.propertyType || 'UNKNOWN',
    yearBuilt: raw.yearBuilt || 0,
    url: raw.url || '',
  };
}

export function filterProperties(properties: Property[], options: FilterOptions): Property[] {
  return properties.filter((p) => {
    if (options.minPrice !== undefined && p.price < options.minPrice) return false;
    if (options.maxPrice !== undefined && p.price > options.maxPrice) return false;
    if (options.minBeds !== undefined && p.beds < options.minBeds) return false;
    if (options.maxBeds !== undefined && p.beds > options.maxBeds) return false;
    if (options.minBaths !== undefined && p.baths < options.minBaths) return false;
    if (options.maxBaths !== undefined && p.baths > options.maxBaths) return false;
    if (options.propertyType && !options.propertyType.includes(p.propertyType)) return false;
    return true;
  });
}

export type SortKey = 'price-asc' | 'price-desc' | 'beds-asc' | 'beds-desc' | 'baths-asc' | 'baths-desc';

const sortStrategies: Record<SortKey, (a: Property, b: Property) => number> = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'beds-asc': (a, b) => a.beds - b.beds,
  'beds-desc': (a, b) => b.beds - a.beds,
  'baths-asc': (a, b) => a.baths - b.baths,
  'baths-desc': (a, b) => b.baths - a.baths,
};

export function sortProperties(properties: Property[], sortKey: SortKey): Property[] {
  return [...properties].sort(sortStrategies[sortKey]);
}

export function paginateProperties<T>(items: T[], page: number, itemsPerPage: number): PaginatedResponse<T> {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return {
    items: items.slice(start, end),
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
  };
}
