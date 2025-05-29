import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import containerService from './containerService';
import { mockContainerDetail, mockContainerMetrics, mockContainerCrops, mockContainerActivities } from './mockData';
import config from './config';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Container Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset config to enable real API calls
    vi.spyOn(config.api, 'enableMockFallback', 'get').mockReturnValue(false);
    vi.spyOn(config.api, 'isDevelopment', 'get').mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getContainerById', () => {
    it('should fetch container details successfully', async () => {
      const expectedResponse = mockContainerDetail;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => expectedResponse,
      });

      const result = await containerService.getContainerById('farm-container-04');

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containerById('farm-container-04')}`,
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
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Container not found',
      });

      await expect(containerService.getContainerById('invalid-id')).rejects.toThrow(
        'API request failed: 404 Not Found. Container not found'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(containerService.getContainerById('farm-container-04')).rejects.toThrow(
        'Network error: Unable to connect to the API server. Please check if the backend is running.'
      );
    });

    it('should fall back to mock data when enabled', async () => {
      vi.spyOn(config.api, 'enableMockFallback', 'get').mockReturnValue(true);
      vi.spyOn(config.api, 'isDevelopment', 'get').mockReturnValue(true);
      
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const result = await containerService.getContainerById('farm-container-04');
      expect(result).toEqual(mockContainerDetail);
    });
  });

  describe('getContainerMetrics', () => {
    it('should fetch container metrics with time range', async () => {
      const expectedResponse = mockContainerMetrics;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => expectedResponse,
      });

      const result = await containerService.getContainerMetrics('farm-container-04', 'WEEK');

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containerMetrics('farm-container-04')}?time_range=WEEK`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should use default time range when not provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockContainerMetrics,
      });

      await containerService.getContainerMetrics('farm-container-04');

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containerMetrics('farm-container-04')}?time_range=WEEK`,
        expect.any(Object)
      );
    });

    it('should fall back to mock data when API fails', async () => {
      vi.spyOn(config.api, 'enableMockFallback', 'get').mockReturnValue(true);
      vi.spyOn(config.api, 'isDevelopment', 'get').mockReturnValue(true);
      
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const result = await containerService.getContainerMetrics('farm-container-04', 'MONTH');
      expect(result).toEqual(mockContainerMetrics);
    });
  });

  describe('getContainerCrops', () => {
    it('should fetch container crops with pagination', async () => {
      const expectedResponse = mockContainerCrops;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => expectedResponse,
      });

      const result = await containerService.getContainerCrops('farm-container-04', 0, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containerCrops('farm-container-04')}?page=0&page_size=10`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should include seed type filter when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockContainerCrops,
      });

      await containerService.getContainerCrops('farm-container-04', 0, 10, 'Lettuce');

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containerCrops('farm-container-04')}?page=0&page_size=10&seed_type=Lettuce`,
        expect.any(Object)
      );
    });

    it('should use default pagination values', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockContainerCrops,
      });

      await containerService.getContainerCrops('farm-container-04');

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containerCrops('farm-container-04')}?page=0&page_size=${config.ui.defaultPageSize}`,
        expect.any(Object)
      );
    });
  });

  describe('getContainerActivities', () => {
    it('should fetch container activities with limit', async () => {
      const expectedResponse = mockContainerActivities;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => expectedResponse,
      });

      const result = await containerService.getContainerActivities('farm-container-04', 10);

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containerActivities('farm-container-04')}?limit=10`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should use default limit when not provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockContainerActivities,
      });

      await containerService.getContainerActivities('farm-container-04');

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containerActivities('farm-container-04')}?limit=5`,
        expect.any(Object)
      );
    });
  });

  describe('getContainers', () => {
    it('should fetch containers list with pagination', async () => {
      const expectedResponse = { data: [mockContainerDetail], count: 1 };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => expectedResponse,
      });

      const result = await containerService.getContainers(0, 20);

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containers}?skip=0&limit=20`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should use default pagination values', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [], count: 0 }),
      });

      await containerService.getContainers();

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containers}?skip=0&limit=${config.ui.maxItemsPerPage}`,
        expect.any(Object)
      );
    });
  });

  describe('createContainer', () => {
    it('should create a new container', async () => {
      const newContainerData = {
        name: 'test-container',
        type: 'PHYSICAL' as const,
        tenant: 'test-tenant',
        purpose: 'Development' as const,
        location: { city: 'Test City', country: 'Test Country', address: 'Test Address' },
        status: 'ACTIVE' as const,
        creator: 'Test User',
        seed_types: ['test-seed'],
        notes: 'Test notes',
        shadow_service_enabled: false,
        ecosystem_connected: false,
        system_integrations: {
          fa_integration: { name: 'Test', enabled: false },
          aws_environment: { name: 'Test', enabled: false },
          mbai_environment: { name: 'Test', enabled: false },
        },
      };
      
      const expectedResponse = { ...newContainerData, id: 'new-container-id', created: '2025-01-01', modified: '2025-01-01' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => expectedResponse,
      });

      const result = await containerService.createContainer(newContainerData);

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containers}`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(newContainerData),
        })
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updateContainer', () => {
    it('should update an existing container', async () => {
      const updateData = { name: 'updated-container-name', notes: 'Updated notes' };
      const expectedResponse = { ...mockContainerDetail, ...updateData };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => expectedResponse,
      });

      const result = await containerService.updateContainer('farm-container-04', updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containerById('farm-container-04')}`,
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(updateData),
        })
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteContainer', () => {
    it('should delete a container', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await containerService.deleteContainer('farm-container-04');

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containerById('farm-container-04')}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should handle delete errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: async () => 'Permission denied',
      });

      await expect(containerService.deleteContainer('farm-container-04')).rejects.toThrow(
        'API request failed: 403 Forbidden. Permission denied'
      );
    });
  });

  describe('Request timeout handling', () => {
    it('should timeout long-running requests', async () => {
      const originalTimeout = config.api.timeout;
      vi.spyOn(config.api, 'timeout', 'get').mockReturnValue(100); // 100ms timeout

      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 200)) // 200ms delay
      );

      await expect(containerService.getContainerById('farm-container-04')).rejects.toThrow();
      
      vi.spyOn(config.api, 'timeout', 'get').mockReturnValue(originalTimeout);
    });
  });

  describe('Query parameter handling', () => {
    it('should handle undefined and null parameters correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockContainerCrops,
      });

      await containerService.getContainerCrops('farm-container-04', 0, 10, undefined);

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containerCrops('farm-container-04')}?page=0&page_size=10`,
        expect.any(Object)
      );
    });
  });

  describe('Response handling', () => {
    it('should handle empty responses for DELETE operations', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await containerService.deleteContainer('farm-container-04');
      expect(result).toEqual({});
    });

    it('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(containerService.getContainerById('farm-container-04')).rejects.toThrow('Invalid JSON');
    });
  });
});