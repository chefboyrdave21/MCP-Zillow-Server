import { ZillowService } from '../services/zillow.js';

export class PropertyController {
  constructor(private zillowService: ZillowService) {}

  async searchProperties(location: string) {
    return this.zillowService.searchProperties(location);
  }

  async getPropertyDetails(zpid: string) {
    return this.zillowService.getPropertyDetails(zpid);
  }
} 