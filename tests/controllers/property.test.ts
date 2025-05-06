import { describe, expect, test, jest } from '@jest/globals';
import { PropertyController } from '../../src/controllers/property.js';
import { ZillowService } from '../../src/services/zillow.js';

// Mock the ZillowService
jest.mock('../../src/services/zillow.js');

describe('PropertyController', () => {
  let controller: PropertyController;
  let mockZillowService: jest.Mocked<ZillowService>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create a fresh instance of the mocked service
    mockZillowService = new ZillowService('test-api-key') as jest.Mocked<ZillowService>;
    
    // Create a new controller instance with the mock service
    controller = new PropertyController(mockZillowService);
  });

  describe('searchProperties', () => {
    test('returns search results for valid location', async () => {
      const mockResults = [
        { zpid: '123', address: '123 Main St', price: 500000 },
        { zpid: '456', address: '456 Oak Ave', price: 750000 }
      ];

      // Setup mock implementation
      mockZillowService.searchProperties.mockResolvedValue(mockResults);

      const result = await controller.searchProperties('San Francisco, CA');

      expect(result).toEqual(mockResults);
      expect(mockZillowService.searchProperties).toHaveBeenCalledWith('San Francisco, CA');
      expect(mockZillowService.searchProperties).toHaveBeenCalledTimes(1);
    });

    test('handles empty search results', async () => {
      mockZillowService.searchProperties.mockResolvedValue([]);

      const result = await controller.searchProperties('NonExistent Location');

      expect(result).toEqual([]);
      expect(mockZillowService.searchProperties).toHaveBeenCalledWith('NonExistent Location');
    });

    test('throws error for invalid location', async () => {
      const errorMessage = 'Invalid location format';
      mockZillowService.searchProperties.mockRejectedValue(new Error(errorMessage));

      await expect(controller.searchProperties('')).rejects.toThrow(errorMessage);
    });
  });

  describe('getPropertyDetails', () => {
    test('returns property details for valid zpid', async () => {
      const mockDetails = {
        zpid: '123',
        address: '123 Main St',
        price: 500000,
        bedrooms: 3,
        bathrooms: 2
      };

      mockZillowService.getPropertyDetails.mockResolvedValue(mockDetails);

      const result = await controller.getPropertyDetails('123');

      expect(result).toEqual(mockDetails);
      expect(mockZillowService.getPropertyDetails).toHaveBeenCalledWith('123');
      expect(mockZillowService.getPropertyDetails).toHaveBeenCalledTimes(1);
    });

    test('throws error for invalid zpid', async () => {
      const errorMessage = 'Property not found';
      mockZillowService.getPropertyDetails.mockRejectedValue(new Error(errorMessage));

      await expect(controller.getPropertyDetails('invalid')).rejects.toThrow(errorMessage);
    });
  });
}); 