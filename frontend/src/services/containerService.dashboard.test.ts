import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import containerService from './containerService';
import { ContainerFilterParams, ContainerCreate, ContainerUpdate } from '../shared/types/containers';

// Mock the config
vi.mock('./config', () => ({
  default: {
    api: {
      baseUrl: 'http://localhost:8000/api/v1',
      enableMockFallback: false,
      isDevelopment: true,
      timeout: 10000,
    },
    endpoints: {
      containers: '/containers',
      containerById: (id: string) => `/containers/${id}`,
      containerStats: '/containers/stats',
      containerShutdown: (id: string) => `/containers/${id}/shutdown`,
    }
  }
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Container Service - Dashboard Methods', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getContainersList', () => {
    it('should fetch containers list with default parameters', async () => {
      const mockResponse = {
        total: 2,
        results: [
          {
            id: '1',
            name: 'Container 1',
            type: 'PHYSICAL',
            tenant_name: 'Acme Corp',
            purpose: 'Production',
            location_city: 'New York',
            location_country: 'USA',
            status: 'ACTIVE',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
            has_alerts: false
          },
          {
            id: '2',
            name: 'Container 2',
            type: 'VIRTUAL',
            tenant_name: 'TechStart Inc',
            purpose: 'Development',
            location_city: 'San Francisco',
            location_country: 'USA',
            status: 'ACTIVE',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
            has_alerts: true
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await containerService.getContainersList();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/containers',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        })
      );

      expect(result).toEqual(mockResponse);
      expect(result.total).toBe(2);
      expect(result.results).toHaveLength(2);
    });

    it('should fetch containers list with filter parameters', async () => {
      const filterParams: ContainerFilterParams = {
        skip: 10,
        limit: 5,
        name: 'test',
        type: 'PHYSICAL',
        status: 'ACTIVE',
        has_alerts: true,
        tenant_id: 'tenant-123',
        purpose: 'Production',
        location: 'New York'
      };

      const mockResponse = {
        total: 1,
        results: [{
          id: '1',
          name: 'Test Container',
          type: 'PHYSICAL',
          tenant_name: 'Acme Corp',
          purpose: 'Production',
          location_city: 'New York',
          location_country: 'USA',
          status: 'ACTIVE',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
          has_alerts: true
        }]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await containerService.getContainersList(filterParams);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/containers?skip=10&limit=5&name=test&tenant_id=tenant-123&type=PHYSICAL&purpose=Production&status=ACTIVE&has_alerts=true&location=New+York',
        expect.any(Object)
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty filter parameters', async () => {
      const mockResponse = { total: 0, results: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await containerService.getContainersList({});

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/containers',
        expect.any(Object)
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error occurred',
      });

      await expect(containerService.getContainersList()).rejects.toThrow(
        'API request failed: 500 Internal Server Error. Server error occurred'
      );
    });
  });

  describe('getContainerStats', () => {
    it('should fetch container statistics', async () => {
      const mockStats = {
        physical_count: 12,
        virtual_count: 8
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      });

      const result = await containerService.getContainerStats();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/containers/stats',
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(result).toEqual(mockStats);
      expect(result.physical_count).toBe(12);
      expect(result.virtual_count).toBe(8);
    });

    it('should handle stats API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Stats endpoint not found',
      });

      await expect(containerService.getContainerStats()).rejects.toThrow(
        'API request failed: 404 Not Found. Stats endpoint not found'
      );
    });
  });

  describe('createContainerDashboard', () => {
    it('should create a new container', async () => {
      const containerData: ContainerCreate = {
        name: 'New Container',
        type: 'PHYSICAL',
        tenant_id: 'tenant-123',
        purpose: 'Development',
        location_city: 'Boston',
        location_country: 'USA',
        notes: 'Test container'
      };

      const mockCreatedContainer = {
        id: 'new-container-id',
        name: 'New Container',
        type: 'PHYSICAL',
        tenant_name: 'Acme Corp',
        purpose: 'Development',
        location_city: 'Boston',
        location_country: 'USA',
        status: 'CREATED',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        has_alerts: false
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatedContainer,
      });

      const result = await containerService.createContainerDashboard(containerData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/containers',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(containerData)
        })
      );

      expect(result).toEqual(mockCreatedContainer);
      expect(result.id).toBe('new-container-id');
      expect(result.name).toBe('New Container');
    });

    it('should handle creation errors', async () => {
      const containerData: ContainerCreate = {
        name: 'Invalid Container',
        type: 'PHYSICAL',
        tenant_id: 'invalid-tenant',
        purpose: 'Development'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Invalid tenant ID',
      });

      await expect(containerService.createContainerDashboard(containerData)).rejects.toThrow(
        'API request failed: 400 Bad Request. Invalid tenant ID'
      );
    });
  });

  describe('updateContainerDashboard', () => {
    it('should update an existing container', async () => {
      const containerId = 'container-123';
      const updateData: ContainerUpdate = {
        name: 'Updated Container',
        status: 'MAINTENANCE',
        notes: 'Updated notes'
      };

      const mockUpdatedContainer = {
        id: 'container-123',
        name: 'Updated Container',
        type: 'PHYSICAL',
        tenant_name: 'Acme Corp',
        purpose: 'Production',
        location_city: 'New York',
        location_country: 'USA',
        status: 'MAINTENANCE',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        has_alerts: false
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedContainer,
      });

      const result = await containerService.updateContainerDashboard(containerId, updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/containers/container-123',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData)
        })
      );

      expect(result).toEqual(mockUpdatedContainer);
      expect(result.name).toBe('Updated Container');
      expect(result.status).toBe('MAINTENANCE');
    });
  });

  describe('shutdownContainer', () => {
    it('should shutdown a container', async () => {
      const containerId = 'container-123';
      const mockShutdownContainer = {
        id: 'container-123',
        name: 'Container 1',
        type: 'PHYSICAL',
        tenant_name: 'Acme Corp',
        purpose: 'Production',
        location_city: 'New York',
        location_country: 'USA',
        status: 'INACTIVE',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        has_alerts: false
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockShutdownContainer,
      });

      const result = await containerService.shutdownContainer(containerId);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/containers/container-123/shutdown',
        expect.objectContaining({
          method: 'POST'
        })
      );

      expect(result).toEqual(mockShutdownContainer);
      expect(result.status).toBe('INACTIVE');
    });
  });

  describe('getContainerSummaryById', () => {
    it('should fetch a single container summary', async () => {
      const containerId = 'container-123';
      const mockContainer = {
        id: 'container-123',
        name: 'Container 1',
        type: 'PHYSICAL',
        tenant_name: 'Acme Corp',
        purpose: 'Production',
        location_city: 'New York',
        location_country: 'USA',
        status: 'ACTIVE',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        has_alerts: true
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockContainer,
      });

      const result = await containerService.getContainerSummaryById(containerId);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/containers/container-123',
        expect.objectContaining({
          method: 'GET'
        })
      );

      expect(result).toEqual(mockContainer);
      expect(result.id).toBe('container-123');
    });

    it('should handle not found errors', async () => {
      const containerId = 'non-existent-container';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Container not found',
      });

      await expect(containerService.getContainerSummaryById(containerId)).rejects.toThrow(
        'API request failed: 404 Not Found. Container not found'
      );
    });
  });

  describe('Network error handling', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

      await expect(containerService.getContainersList()).rejects.toThrow(
        'Network error: Unable to connect to the API server. Please check if the backend is running.'
      );
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));

      await expect(containerService.getContainersList()).rejects.toThrow(
        'AbortError'
      );
    });
  });

  describe('Parameter encoding', () => {
    it('should properly encode URL parameters', async () => {
      const filterParams: ContainerFilterParams = {
        name: 'Container with spaces & special chars',
        location: 'New York, NY'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 0, results: [] }),
      });

      await containerService.getContainersList(filterParams);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/containers?name=Container+with+spaces+%26+special+chars&location=New+York%2C+NY',
        expect.any(Object)
      );
    });

    it('should skip undefined and null parameters', async () => {
      const filterParams: ContainerFilterParams = {
        name: 'test',
        type: undefined,
        tenant_id: null as any,
        skip: 0
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total: 0, results: [] }),
      });

      await containerService.getContainersList(filterParams);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/containers?name=test&skip=0',
        expect.any(Object)
      );
    });
  });
});