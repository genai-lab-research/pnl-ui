import { cropService } from '../cropService';
import { TokenStorage } from '../../utils/tokenStorage';
import { 
  Crop, 
  CropCreateRequest, 
  CropFilterCriteria,
  CropHistory,
  CropHistoryCreateRequest,
  CropSnapshot,
  CropSnapshotCreateRequest
} from '../../types/recipe';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock TokenStorage
jest.mock('../../utils/tokenStorage');
const mockTokenStorage = TokenStorage as jest.Mocked<typeof TokenStorage>;

describe('CropService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockTokenStorage.getAccessToken.mockReturnValue('mock-token');
  });

  const mockCrop: Crop = {
    id: 1,
    seed_type_id: 1,
    seed_date: '2023-01-01',
    transplanting_date_planned: '2023-01-15',
    transplanting_date: '2023-01-16',
    harvesting_date_planned: '2023-02-15',
    harvesting_date: '2023-02-16',
    lifecycle_status: 'growing',
    health_check: 'healthy',
    current_location: { row: 1, column: 1 },
    last_location: { row: 1, column: 2 },
    measurements_id: 1,
    image_url: 'https://example.com/image.jpg',
    recipe_version_id: 1,
    accumulated_light_hours: 100.5,
    accumulated_water_hours: 80.0,
    notes: 'Test crop notes'
  };

  const mockCropHistory: CropHistory = {
    crop_id: 1,
    timestamp: '2023-01-16T10:00:00Z',
    event: 'transplanted',
    performed_by: 'testuser',
    notes: 'Crop transplanted successfully'
  };

  const mockCropSnapshot: CropSnapshot = {
    id: 1,
    timestamp: '2023-01-16T10:00:00Z',
    crop_id: 1,
    lifecycle_status: 'growing',
    health_status: 'healthy',
    recipe_version_id: 1,
    location: { row: 1, column: 1 },
    measurements_id: 1,
    accumulated_light_hours: 100.5,
    accumulated_water_hours: 80.0,
    image_url: 'https://example.com/snapshot.jpg'
  };

  describe('getAllCrops', () => {
    it('should fetch all crops successfully', async () => {
      const mockCrops = [mockCrop];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCrops)
      } as Response);

      const result = await cropService.getAllCrops();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/crops/',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
      expect(result).toEqual(mockCrops);
    });

    it('should fetch crops with filters', async () => {
      const filters: CropFilterCriteria = {
        search: 'lettuce',
        seed_type_id: 1,
        lifecycle_status: 'growing',
        health_check: 'healthy',
        recipe_version_id: 1,
        page: 1,
        limit: 10
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockCrop])
      } as Response);

      await cropService.getAllCrops(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/crops/?search=lettuce&seed_type_id=1&lifecycle_status=growing&health_check=healthy&recipe_version_id=1&page=1&limit=10',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });

  describe('getCropById', () => {
    it('should fetch crop by ID successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCrop)
      } as Response);

      const result = await cropService.getCropById(1);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/crops/1',
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toEqual(mockCrop);
    });
  });

  describe('createCrop', () => {
    it('should create crop successfully', async () => {
      const createRequest: CropCreateRequest = {
        seed_type_id: 1,
        seed_date: '2023-01-01',
        transplanting_date_planned: '2023-01-15',
        harvesting_date_planned: '2023-02-15',
        lifecycle_status: 'seeding',
        health_check: 'healthy',
        current_location: { row: 1, column: 1 },
        recipe_version_id: 1,
        notes: 'New crop'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockCrop, ...createRequest })
      } as Response);

      const result = await cropService.createCrop(createRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/crops/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(createRequest),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          })
        })
      );
      expect(result.notes).toBe(createRequest.notes);
    });
  });

  describe('updateCrop', () => {
    it('should update crop successfully', async () => {
      const updateRequest: CropCreateRequest = {
        ...mockCrop,
        lifecycle_status: 'harvested',
        notes: 'Updated crop'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockCrop, ...updateRequest })
      } as Response);

      const result = await cropService.updateCrop(1, updateRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/crops/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateRequest)
        })
      );
      expect(result.lifecycle_status).toBe('harvested');
    });
  });

  describe('deleteCrop', () => {
    it('should delete crop successfully', async () => {
      const mockResponse = { message: 'Crop deleted successfully' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const result = await cropService.deleteCrop(1);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/crops/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Crop History Management', () => {
    describe('getCropHistory', () => {
      it('should fetch crop history successfully', async () => {
        const mockHistory = [mockCropHistory];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockHistory)
        } as Response);

        const result = await cropService.getCropHistory(1);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/crops/1/history',
          expect.objectContaining({
            method: 'GET'
          })
        );
        expect(result).toEqual(mockHistory);
      });
    });

    describe('addCropHistoryEvent', () => {
      it('should add crop history event successfully', async () => {
        const eventRequest: CropHistoryCreateRequest = {
          event: 'watered',
          performed_by: 'testuser',
          notes: 'Daily watering'
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockCropHistory, ...eventRequest })
        } as Response);

        const result = await cropService.addCropHistoryEvent(1, eventRequest);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/crops/1/history',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(eventRequest)
          })
        );
        expect(result.event).toBe(eventRequest.event);
      });
    });
  });

  describe('Crop Snapshots Management', () => {
    describe('getCropSnapshots', () => {
      it('should fetch crop snapshots successfully', async () => {
        const mockSnapshots = [mockCropSnapshot];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSnapshots)
        } as Response);

        const result = await cropService.getCropSnapshots(1);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/crops/1/snapshots',
          expect.objectContaining({
            method: 'GET'
          })
        );
        expect(result).toEqual(mockSnapshots);
      });

      it('should fetch crop snapshots with date filters', async () => {
        const filters = {
          start_date: '2023-01-01T00:00:00Z',
          end_date: '2023-12-31T23:59:59Z'
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([mockCropSnapshot])
        } as Response);

        await cropService.getCropSnapshots(1, filters);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/crops/1/snapshots?start_date=2023-01-01T00%3A00%3A00Z&end_date=2023-12-31T23%3A59%3A59Z',
          expect.objectContaining({
            method: 'GET'
          })
        );
      });
    });

    describe('createCropSnapshot', () => {
      it('should create crop snapshot successfully', async () => {
        const snapshotRequest: CropSnapshotCreateRequest = {
          lifecycle_status: 'growing',
          health_status: 'healthy',
          recipe_version_id: 1,
          location: { row: 1, column: 1 },
          measurements_id: 1,
          accumulated_light_hours: 105.0,
          accumulated_water_hours: 85.0,
          image_url: 'https://example.com/new-snapshot.jpg'
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockCropSnapshot, ...snapshotRequest })
        } as Response);

        const result = await cropService.createCropSnapshot(1, snapshotRequest);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/crops/1/snapshots',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(snapshotRequest)
          })
        );
        expect(result.accumulated_light_hours).toBe(105.0);
      });
    });
  });

  describe('Convenience Methods', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockCrop])
      } as Response);
    });

    it('should search crops', async () => {
      await cropService.searchCrops('lettuce');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=lettuce'),
        expect.any(Object)
      );
    });

    it('should get crops by recipe version', async () => {
      await cropService.getCropsByRecipeVersion(1);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('recipe_version_id=1'),
        expect.any(Object)
      );
    });

    it('should get paginated crops', async () => {
      await cropService.getPaginatedCrops(2, 20, { seed_type_id: 1 });
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2&limit=20&seed_type_id=1'),
        expect.any(Object)
      );
    });

    it('should get crop snapshots in date range', async () => {
      await cropService.getCropSnapshotsInDateRange(1, '2023-01-01', '2023-01-31');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('start_date=2023-01-01&end_date=2023-01-31'),
        expect.any(Object)
      );
    });
  });

  describe('Lifecycle Management Methods', () => {
    beforeEach(() => {
      // Mock getCropById for lifecycle methods
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCrop)
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockCrop, lifecycle_status: 'transplanted' })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCropHistory)
        } as Response);
    });

    describe('transplantCrop', () => {
      it('should transplant crop successfully', async () => {
        const result = await cropService.transplantCrop(1, '2023-01-16', 'testuser', 'Successful transplant');

        expect(mockFetch).toHaveBeenCalledTimes(3);
        expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/v1/crops/1', expect.any(Object));
        expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/v1/crops/1', expect.objectContaining({
          method: 'PUT'
        }));
        expect(mockFetch).toHaveBeenNthCalledWith(3, '/api/v1/crops/1/history', expect.objectContaining({
          method: 'POST'
        }));
        expect(result).toEqual(mockCropHistory);
      });
    });

    describe('harvestCrop', () => {
      beforeEach(() => {
        mockFetch.mockClear();
        mockFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockCrop)
          } as Response)
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ ...mockCrop, lifecycle_status: 'harvested' })
          } as Response)
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ ...mockCropHistory, event: 'harvested' })
          } as Response);
      });

      it('should harvest crop successfully', async () => {
        const result = await cropService.harvestCrop(1, '2023-02-16', 'testuser', 'Successful harvest');

        expect(mockFetch).toHaveBeenCalledTimes(3);
        expect(result.event).toBe('harvested');
      });
    });

    describe('updateCropHealth', () => {
      beforeEach(() => {
        mockFetch.mockClear();
        mockFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockCrop)
          } as Response)
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ ...mockCrop, health_check: 'excellent' })
          } as Response)
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ ...mockCropHistory, event: 'health_check_updated' })
          } as Response);
      });

      it('should update crop health successfully', async () => {
        const result = await cropService.updateCropHealth(1, 'excellent', 'testuser', 'Health improved');

        expect(mockFetch).toHaveBeenCalledTimes(3);
        expect(result.event).toBe('health_check_updated');
      });
    });
  });

  describe('Authentication', () => {
    it('should handle 401 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: 'Token expired' })
      } as Response);

      await expect(cropService.getAllCrops()).rejects.toThrow('Authentication required');
    });

    it('should include authorization headers in all requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      } as Response);

      await cropService.getAllCrops();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
    });
  });
});