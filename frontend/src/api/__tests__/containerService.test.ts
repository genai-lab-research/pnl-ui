import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContainerService } from '../containerService';
import { tokenStorage } from '../../utils/tokenStorage';
import {
  Container,
  CreateContainerRequest,
  UpdateContainerRequest,
  ContainerFilterCriteria,
} from '../../types/containers';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock tokenStorage
vi.mock('../../utils/tokenStorage', () => ({
  tokenStorage: {
    getAccessToken: vi.fn(),
    clearToken: vi.fn(),
  },
}));

describe('ContainerService', () => {
  let containerService: ContainerService;

  beforeEach(() => {
    containerService = ContainerService.getInstance('/api/v1');
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockContainer: Container = {
    id: 1,
    name: 'Test Container',
    tenant_id: 1,
    type: 'physical',
    purpose: 'development',
    location: {
      city: 'New York',
      country: 'USA',
      address: '123 Test St',
    },
    notes: 'Test container for development',
    shadow_service_enabled: false,
    copied_environment_from: 0,
    robotics_simulation_enabled: false,
    ecosystem_connected: false,
    ecosystem_settings: {},
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    seed_types: [],
    alerts: [],
    settings: {
      shadow_service_enabled: false,
      copied_environment_from: 0,
      robotics_simulation_enabled: false,
      ecosystem_connected: false,
      ecosystem_settings: {},
    },
    environment: {
      temperature: 22.5,
      humidity: 60,
      co2: 400,
      light_intensity: 1000,
    },
    inventory: {
      total_capacity: 100,
      used_capacity: 75,
      available_capacity: 25,
      seed_count: 50,
    },
    metrics: {
      yield_kg: 45.2,
      space_utilization_pct: 75,
      growth_rate: 0.95,
      health_score: 8.5,
    },
  };

  beforeEach(() => {
    vi.mocked(tokenStorage.getAccessToken).mockReturnValue('valid-token');
  });

  describe('getContainers', () => {
    const mockContainerListResponse = {
      containers: [mockContainer],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
      },
      performance_metrics: {
        physical: {
          container_count: 1,
          yield: {
            average: 45.2,
            total: 45.2,
            chart_data: [],
          },
          space_utilization: {
            average: 75,
            chart_data: [],
          },
        },
        virtual: {
          container_count: 0,
          yield: {
            average: 0,
            total: 0,
            chart_data: [],
          },
          space_utilization: {
            average: 0,
            chart_data: [],
          },
        },
        time_range: {
          type: 'week',
          start_date: '2023-01-01T00:00:00Z',
          end_date: '2023-01-07T23:59:59Z',
        },
        generated_at: '2023-01-01T00:00:00Z',
      },
    };

    it('should get containers successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockContainerListResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getContainers();

      expect(result).toEqual(mockContainerListResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-token',
          }),
        })
      );
    });

    it('should handle filters correctly', async () => {
      const filters: ContainerFilterCriteria = {
        search: 'test',
        type: 'physical',
        page: 2,
        limit: 25,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockContainerListResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await containerService.getContainers(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/?search=test&type=physical&page=2&limit=25',
        expect.any(Object)
      );
    });

    it('should handle authentication errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ detail: 'Not authenticated' }),
      });

      await expect(containerService.getContainers()).rejects.toThrow('Authentication required');
      expect(tokenStorage.clearToken).toHaveBeenCalled();
    });
  });

  describe('getContainer', () => {
    it('should get container by ID successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockContainer,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getContainer(1);

      expect(result).toEqual(mockContainer);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-token',
          }),
        })
      );
    });

    it('should handle not found errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ detail: 'Container not found' }),
      });

      await expect(containerService.getContainer(999)).rejects.toThrow('Container not found');
    });
  });

  describe('createContainer', () => {
    const createRequest: CreateContainerRequest = {
      name: 'New Container',
      tenant_id: 1,
      type: 'physical',
      purpose: 'development',
      location: {
        city: 'New York',
        country: 'USA',
        address: '123 Test St',
      },
      notes: 'New test container',
      shadow_service_enabled: false,
      robotics_simulation_enabled: false,
      ecosystem_connected: false,
      ecosystem_settings: {},
      status: 'created',
      seed_type_ids: [1, 2],
    };

    it('should create container successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockContainer,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.createContainer(createRequest);

      expect(result).toEqual(mockContainer);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(createRequest),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid-token',
          }),
        })
      );
    });

    it('should handle validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          detail: [
            {
              type: 'validation_error',
              loc: ['name'],
              msg: 'Field required',
              input: null,
            },
          ],
        }),
      });

      await expect(containerService.createContainer(createRequest)).rejects.toThrow('name: Field required');
    });
  });

  describe('updateContainer', () => {
    const updateRequest: UpdateContainerRequest = {
      name: 'Updated Container',
      notes: 'Updated notes',
    };

    it('should update container successfully', async () => {
      const updatedContainer = { ...mockContainer, ...updateRequest };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updatedContainer,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.updateContainer(1, updateRequest);

      expect(result).toEqual(updatedContainer);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateRequest),
        })
      );
    });
  });

  describe('deleteContainer', () => {
    it('should delete container successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers(),
      });

      await containerService.deleteContainer(1);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('getPerformanceMetrics', () => {
    const mockMetrics = {
      physical: {
        container_count: 1,
        yield: {
          average: 45.2,
          total: 45.2,
          chart_data: [],
        },
        space_utilization: {
          average: 75,
          chart_data: [],
        },
      },
      virtual: {
        container_count: 0,
        yield: {
          average: 0,
          total: 0,
          chart_data: [],
        },
        space_utilization: {
          average: 0,
          chart_data: [],
        },
      },
      time_range: {
        type: 'week' as const,
        start_date: '2023-01-01T00:00:00Z',
        end_date: '2023-01-07T23:59:59Z',
      },
      generated_at: '2023-01-01T00:00:00Z',
    };

    it('should get performance metrics successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMetrics,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getPerformanceMetrics();

      expect(result).toEqual(mockMetrics);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/metrics',
        expect.any(Object)
      );
    });

    it('should handle metrics filters', async () => {
      const filters = {
        timeRange: 'month' as const,
        type: 'physical' as const,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMetrics,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await containerService.getPerformanceMetrics(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/metrics?timeRange=month&type=physical',
        expect.any(Object)
      );
    });
  });

  describe('shutdownContainer', () => {
    const mockShutdownResponse = {
      success: true,
      message: 'Container shutdown successfully',
      container_id: 1,
    };

    it('should shutdown container successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockShutdownResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.shutdownContainer(1, {
        reason: 'Maintenance',
        force: false,
      });

      expect(result).toEqual(mockShutdownResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/1/shutdown',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ reason: 'Maintenance', force: false }),
        })
      );
    });
  });

  describe('getFilterOptions', () => {
    const mockFilterOptions = {
      tenants: [
        { id: 1, name: 'Tenant 1' },
        { id: 2, name: 'Tenant 2' },
      ],
      purposes: ['development', 'research', 'production'],
      statuses: ['created', 'active', 'maintenance', 'inactive'],
      container_types: ['physical', 'virtual'],
    };

    it('should get filter options successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockFilterOptions,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getFilterOptions();

      expect(result).toEqual(mockFilterOptions);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/filter-options',
        expect.any(Object)
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists and is valid', () => {
      vi.mocked(tokenStorage.getAccessToken).mockReturnValue('valid-token');

      const result = containerService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when no token exists', () => {
      vi.mocked(tokenStorage.getAccessToken).mockReturnValue(null);

      const result = containerService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(containerService.getContainers()).rejects.toThrow('Network request failed');
    });

    it('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'text/html' }),
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      await expect(containerService.getContainers()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });
});