export interface ZillowSearchParams {
  location: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  homeType?: string;
  cursor?: string;
  ignoreRobotsText?: boolean;
}

export interface ZillowPropertyParams {
  zpid: string;
  ignoreRobotsText?: boolean;
} 