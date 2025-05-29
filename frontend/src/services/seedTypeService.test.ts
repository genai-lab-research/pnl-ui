import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import seedTypeService from './seedTypeService';
import config from './config';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockSeedTypes = [
  { id: 'seed-001', name: 'Someroots', variety: 'Standard', supplier: 'BioCrop' },
  { id: 'seed-002', name: 'Sunflower', variety: 'Giant', supplier: 'SeedPro' },
  { id: 'seed-003', name: 'Basil', variety: 'Sweet', supplier: 'HerbGarden' },
];

describe('Seed Type Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset config to enable real API calls
    vi.spyOn(config.api, 'enableMockFallback', 'get').mockReturnValue(false);
    vi.spyOn(config.api, 'isDevelopment', 'get').mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSeedTypes', () => {
    it('should fetch seed types successfully', async () => {
      const expectedResponse = mockSeedTypes;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => expectedResponse,
      });

      const result = await seedTypeService.getSeedTypes();

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}/seed-types`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
        })
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error occurred',
      });

      await expect(seedTypeService.getSeedTypes()).rejects.toThrow(
        'API request failed: 500 Internal Server Error. Server error occurred'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

      await expect(seedTypeService.getSeedTypes()).rejects.toThrow(
        'Network error: Unable to connect to the API server. Please check if the backend is running.'
      );
    });

    it('should fall back to mock data when API is unavailable and mock fallback is enabled', async () => {
      // Enable mock fallback
      vi.spyOn(config.api, 'enableMockFallback', 'get').mockReturnValue(true);
      vi.spyOn(config.api, 'isDevelopment', 'get').mockReturnValue(true);
      
      mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

      const result = await seedTypeService.getSeedTypes();

      expect(result).toEqual([
        { id: 'seed-001', name: 'Someroots', variety: 'Standard', supplier: 'BioCrop' },
        { id: 'seed-002', name: 'Sunflower', variety: 'Giant', supplier: 'SeedPro' },
        { id: 'seed-003', name: 'Basil', variety: 'Sweet', supplier: 'HerbGarden' },
        { id: 'seed-004', name: 'Lettuce', variety: 'Romaine', supplier: 'GreenLeaf' },
        { id: 'seed-005', name: 'Kale', variety: 'Curly', supplier: 'Nutrifoods' },
        { id: 'seed-006', name: 'Spinach', variety: 'Baby', supplier: 'GreenLeaf' },
        { id: 'seed-007', name: 'Arugula', variety: 'Wild', supplier: 'HerbGarden' },
        { id: 'seed-008', name: 'Microgreens', variety: 'Mixed', supplier: 'SproutLife' }
      ]);
    });

    it('should handle timeout errors', async () => {
      const abortError = new DOMException('The operation was aborted', 'AbortError');
      mockFetch.mockRejectedValueOnce(abortError);

      await expect(seedTypeService.getSeedTypes()).rejects.toThrow(abortError);
    });

    it('should validate response format', async () => {
      const validResponse = [
        { id: 'seed-001', name: 'Someroots', variety: 'Standard', supplier: 'BioCrop' }
      ];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => validResponse,
      });

      const result = await seedTypeService.getSeedTypes();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('variety');
      expect(result[0]).toHaveProperty('supplier');
    });
  });
});