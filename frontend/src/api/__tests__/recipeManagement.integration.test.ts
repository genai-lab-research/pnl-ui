import { recipeService } from '../recipeService';
import { cropService } from '../cropService';
import { cropMeasurementsService } from '../cropMeasurementsService';
import { TokenStorage } from '../../utils/tokenStorage';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock TokenStorage
jest.mock('../../utils/tokenStorage');
const mockTokenStorage = TokenStorage as jest.Mocked<typeof TokenStorage>;

describe('Recipe Management Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockTokenStorage.getAccessToken.mockReturnValue('mock-integration-token');
  });

  describe('Complete Recipe to Crop Workflow', () => {
    it('should create recipe, version, crop with measurements end-to-end', async () => {
      // Step 1: Create Recipe Master
      const recipeCreateRequest = {
        name: 'Integration Test Recipe',
        crop_type: 'lettuce',
        notes: 'Test recipe for integration'
      };

      const mockRecipe = {
        id: 1,
        ...recipeCreateRequest
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecipe)
      } as Response);

      const recipe = await recipeService.createRecipe(recipeCreateRequest);
      expect(recipe.id).toBe(1);
      expect(recipe.name).toBe('Integration Test Recipe');

      // Step 2: Create Recipe Version
      const versionCreateRequest = {
        version: '1.0',
        valid_from: '2023-01-01T00:00:00Z',
        tray_density: 24,
        air_temperature: 22,
        humidity: 65,
        created_by: 'integration-test'
      };

      const mockVersion = {
        id: 1,
        recipe_id: 1,
        ...versionCreateRequest
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockVersion)
      } as Response);

      const version = await recipeService.createRecipeVersion(1, versionCreateRequest);
      expect(version.id).toBe(1);
      expect(version.recipe_id).toBe(1);

      // Step 3: Create Crop Measurements
      const measurementsCreateRequest = {
        radius: 5.0,
        width: 10.0,
        height: 8.0,
        weight: 150.0
      };

      const mockMeasurements = {
        id: 1,
        ...measurementsCreateRequest
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMeasurements)
      } as Response);

      const measurements = await cropMeasurementsService.createCropMeasurements(measurementsCreateRequest);
      expect(measurements.id).toBe(1);

      // Step 4: Create Crop with Recipe Version and Measurements
      const cropCreateRequest = {
        seed_type_id: 1,
        seed_date: '2023-01-01',
        recipe_version_id: version.id,
        measurements_id: measurements.id,
        lifecycle_status: 'seeding',
        health_check: 'healthy',
        notes: 'Integration test crop'
      };

      const mockCrop = {
        id: 1,
        ...cropCreateRequest
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCrop)
      } as Response);

      const crop = await cropService.createCrop(cropCreateRequest);
      expect(crop.id).toBe(1);
      expect(crop.recipe_version_id).toBe(version.id);
      expect(crop.measurements_id).toBe(measurements.id);

      // Verify all API calls were made correctly
      expect(mockFetch).toHaveBeenCalledTimes(4);
      expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/v1/recipes/', expect.any(Object));
      expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/v1/recipes/1/versions/', expect.any(Object));
      expect(mockFetch).toHaveBeenNthCalledWith(3, '/api/v1/crop-measurements/', expect.any(Object));
      expect(mockFetch).toHaveBeenNthCalledWith(4, '/api/v1/crops/', expect.any(Object));
    });
  });

  describe('Crop Lifecycle with History and Snapshots', () => {
    it('should manage complete crop lifecycle with tracking', async () => {
      const cropId = 1;
      const performedBy = 'integration-test';

      // Mock crop data for lifecycle operations
      const mockCrop = {
        id: cropId,
        seed_type_id: 1,
        seed_date: '2023-01-01',
        recipe_version_id: 1,
        lifecycle_status: 'seeding',
        health_check: 'healthy'
      };

      // Step 1: Transplant crop
      mockFetch
        // getCropById
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCrop)
        } as Response)
        // updateCrop
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockCrop, lifecycle_status: 'transplanted' })
        } as Response)
        // addCropHistoryEvent
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            crop_id: cropId,
            timestamp: '2023-01-15T10:00:00Z',
            event: 'transplanted',
            performed_by: performedBy,
            notes: 'Crop transplanted on 2023-01-15'
          })
        } as Response);

      const transplantHistory = await cropService.transplantCrop(
        cropId, 
        '2023-01-15', 
        performedBy, 
        'Successful transplant'
      );

      expect(transplantHistory.event).toBe('transplanted');
      expect(transplantHistory.performed_by).toBe(performedBy);

      // Step 2: Create snapshot after transplant
      const snapshotRequest = {
        lifecycle_status: 'transplanted',
        health_status: 'healthy',
        recipe_version_id: 1,
        location: { row: 2, column: 3 },
        accumulated_light_hours: 50.0,
        accumulated_water_hours: 40.0
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          id: 1,
          crop_id: cropId,
          timestamp: '2023-01-15T10:30:00Z',
          ...snapshotRequest
        })
      } as Response);

      const snapshot = await cropService.createCropSnapshot(cropId, snapshotRequest);
      expect(snapshot.lifecycle_status).toBe('transplanted');
      expect(snapshot.accumulated_light_hours).toBe(50.0);

      // Step 3: Update crop health
      mockFetch
        // getCropById
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockCrop, lifecycle_status: 'transplanted' })
        } as Response)
        // updateCrop
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ 
            ...mockCrop, 
            lifecycle_status: 'transplanted',
            health_check: 'excellent'
          })
        } as Response)
        // addCropHistoryEvent
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            crop_id: cropId,
            timestamp: '2023-01-20T10:00:00Z',
            event: 'health_check_updated',
            performed_by: performedBy,
            notes: 'Health status updated to: excellent'
          })
        } as Response);

      const healthHistory = await cropService.updateCropHealth(
        cropId, 
        'excellent', 
        performedBy, 
        'Health improved after transplant'
      );

      expect(healthHistory.event).toBe('health_check_updated');

      // Step 4: Harvest crop
      mockFetch
        // getCropById
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ 
            ...mockCrop, 
            lifecycle_status: 'transplanted',
            health_check: 'excellent'
          })
        } as Response)
        // updateCrop
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ 
            ...mockCrop, 
            lifecycle_status: 'harvested',
            harvesting_date: '2023-02-15'
          })
        } as Response)
        // addCropHistoryEvent
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            crop_id: cropId,
            timestamp: '2023-02-15T10:00:00Z',
            event: 'harvested',
            performed_by: performedBy,
            notes: 'Crop harvested on 2023-02-15'
          })
        } as Response);

      const harvestHistory = await cropService.harvestCrop(
        cropId, 
        '2023-02-15', 
        performedBy, 
        'Successful harvest'
      );

      expect(harvestHistory.event).toBe('harvested');

      // Verify all lifecycle operations were called
      expect(mockFetch).toHaveBeenCalledTimes(10); // 3 + 1 + 3 + 3 operations
    });
  });

  describe('Error Handling and Authentication', () => {
    it('should handle authentication failures across services', async () => {
      // Mock 401 response
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: 'Token expired' })
      } as Response);

      // Test that all services handle 401 errors consistently
      await expect(recipeService.getAllRecipes()).rejects.toThrow('Authentication required');
      await expect(cropService.getAllCrops()).rejects.toThrow('Authentication required');
      await expect(cropMeasurementsService.getCropMeasurementsById(1)).rejects.toThrow('Authentication required');
    });

    it('should handle network errors gracefully', async () => {
      // Mock network error
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(recipeService.getAllRecipes()).rejects.toThrow('Network error');
      await expect(cropService.getAllCrops()).rejects.toThrow('Network error');
      await expect(cropMeasurementsService.getCropMeasurementsById(1)).rejects.toThrow('Network error');
    });

    it('should include proper authorization headers in all requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      } as Response);

      await Promise.all([
        recipeService.getAllRecipes(),
        cropService.getAllCrops(),
        cropMeasurementsService.getCropMeasurementsById(1)
      ]);

      // Verify all requests included authorization headers
      expect(mockFetch).toHaveBeenCalledTimes(3);
      mockFetch.mock.calls.forEach(call => {
        expect(call[1]).toEqual(expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-integration-token'
          })
        }));
      });
    });
  });

  describe('Data Consistency and Validation', () => {
    it('should maintain data consistency across related entities', async () => {
      // Test that creating crops with invalid recipe_version_id fails appropriately
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ detail: 'Invalid recipe_version_id' })
      } as Response);

      const invalidCropRequest = {
        seed_type_id: 1,
        recipe_version_id: 999, // Non-existent recipe version
        seed_date: '2023-01-01'
      };

      await expect(cropService.createCrop(invalidCropRequest))
        .rejects.toThrow('Invalid recipe_version_id');

      // Test that creating crops with invalid measurements_id fails appropriately
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ detail: 'Invalid measurements_id' })
      } as Response);

      const invalidMeasurementsRequest = {
        seed_type_id: 1,
        measurements_id: 999, // Non-existent measurements
        seed_date: '2023-01-01'
      };

      await expect(cropService.createCrop(invalidMeasurementsRequest))
        .rejects.toThrow('Invalid measurements_id');
    });
  });

  describe('Filter and Search Functionality', () => {
    it('should handle complex filtering across services', async () => {
      // Mock responses for filtered queries
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      } as Response);

      // Test recipe filtering
      await recipeService.getAllRecipes({
        search: 'lettuce',
        crop_type: 'lettuce',
        active_only: true,
        page: 1,
        limit: 10,
        sort: 'name',
        order: 'asc'
      });

      // Test crop filtering
      await cropService.getAllCrops({
        search: 'test',
        seed_type_id: 1,
        lifecycle_status: 'growing',
        health_check: 'healthy',
        recipe_version_id: 1,
        page: 2,
        limit: 20,
        sort: 'seed_date',
        order: 'desc'
      });

      // Verify complex query string building
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=lettuce&crop_type=lettuce&active_only=true&page=1&limit=10&sort=name&order=asc'),
        expect.any(Object)
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test&seed_type_id=1&lifecycle_status=growing&health_check=healthy&recipe_version_id=1&page=2&limit=20&sort=seed_date&order=desc'),
        expect.any(Object)
      );
    });
  });
});