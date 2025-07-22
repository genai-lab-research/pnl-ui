import { containerApiService } from '../containerApiService';
import { TokenStorage } from '../../utils/tokenStorage';
import { Container, ContainerListResponse, ContainerFilterCriteria } from '../../types/container';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock TokenStorage
jest.mock('../../utils/tokenStorage');
const mockTokenStorage = TokenStorage as jest.Mocked<typeof TokenStorage>;

const mockContainer: Container = {
  id: 1,
  name: 'Test Container',
  tenant_id: 1,
  type: 'physical',
  purpose: 'development',
  location: {
    city: 'Test City',
    country: 'Test Country',
    address: '123 Test St'
  },
  notes: 'Test notes',
  shadow_service_enabled: false,
  copied_environment_from: null,
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
    copied_environment_from: null,
    robotics_simulation_enabled: false,
    ecosystem_connected: false,
    ecosystem_settings: {}
  },
  environment: {
    temperature: 22.5,
    humidity: 60,
    co2: 400,
    light_intensity: 1000
  },
  inventory: {
    total_capacity: 100,
    used_capacity: 60,
    available_capacity: 40,
    seed_count: 50
  },
  metrics: {
    yield_kg: 15.5,
    space_utilization_pct: 85,
    growth_rate: 0.95,
    health_score: 8.7
  }
};

// Helper to create mock Response objects
const createMockResponse = (data: any, status: number = 200, ok: boolean = true): Response => {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    headers: new Headers({ 'content-type': 'application/json' }),
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data)),
    url: 'http://localhost:3000',
    type: 'basic',
    redirected: false,
    bodyUsed: false,
    body: null,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    clone: () => createMockResponse(data, status, ok)
  } as Response;
};

describe('ContainerApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockTokenStorage.getAccessToken.mockReturnValue('mock-token');
  });

  describe('listContainers', () => {
    it('should list containers without filters', async () => {
      const mockResponse: ContainerListResponse = {
        containers: [mockContainer],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          total_pages: 1
        },
        performance_metrics: {
          physical: {
            container_count: 1,
            yield: {
              average: 15.5,
              total: 15.5,
              chart_data: []
            },
            space_utilization: {
              average: 85,
              chart_data: []
            }
          },
          virtual: {
            container_count: 0,
            yield: {
              average: 0,
              total: 0,
              chart_data: []
            },
            space_utilization: {
              average: 0,
              chart_data: []
            }
          },
          time_range: {
            type: 'week',
            start_date: '2023-01-01T00:00:00Z',
            end_date: '2023-01-07T23:59:59Z'
          },
          generated_at: '2023-01-07T12:00:00Z'
        }
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await containerApiService.listContainers();

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token'
        },
        signal: expect.any(AbortSignal)
      });

      expect(result).toEqual(mockResponse);
    });

    it('should list containers with filters', async () => {
      const filters: ContainerFilterCriteria = {
        search: 'test',
        type: 'physical',
        status: 'active',
        page: 1,
        limit: 10
      };

      mockFetch.mockResolvedValueOnce(createMockResponse({ containers: [mockContainer], pagination: {}, performance_metrics: {} }));

      await containerApiService.listContainers(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/?search=test&type=physical&status=active&page=1&limit=10',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token'
          })
        })
      );
    });
  });

  describe('getContainer', () => {
    it('should get container by ID', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockContainer));

      const result = await containerApiService.getContainer(1);

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token'
        },
        signal: expect.any(AbortSignal)
      });

      expect(result).toEqual(mockContainer);
    });

    it('should handle 404 error', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ detail: 'Container not found' }, 404, false));

      await expect(containerApiService.getContainer(999)).rejects.toThrow('Container not found');
    });
  });

  describe('createContainer', () => {
    it('should create container successfully', async () => {
      const createData = {
        name: 'New Container',
        tenant_id: 1,
        type: 'physical' as const,
        purpose: 'development' as const,
        location: {
          city: 'New City',
          country: 'New Country',
          address: '456 New St'
        }
      };

      mockFetch.mockResolvedValueOnce(createMockResponse({ ...mockContainer, ...createData }, 201));

      const result = await containerApiService.createContainer(createData);

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token'
        },
        body: JSON.stringify(createData),
        signal: expect.any(AbortSignal)
      });

      expect(result.name).toBe('New Container');
    });
  });

  describe('updateContainer', () => {
    it('should update container successfully', async () => {
      const updateData = {
        name: 'Updated Container',
        status: 'maintenance' as const
      };

      mockFetch.mockResolvedValueOnce(createMockResponse({ ...mockContainer, ...updateData }));

      const result = await containerApiService.updateContainer(1, updateData);

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token'
        },
        body: JSON.stringify(updateData),
        signal: expect.any(AbortSignal)
      });

      expect(result.name).toBe('Updated Container');
      expect(result.status).toBe('maintenance');
    });
  });

  describe('deleteContainer', () => {
    it('should delete container successfully', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse('', 204));

      await containerApiService.deleteContainer(1);

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token'
        },
        signal: expect.any(AbortSignal)
      });
    });
  });

  describe('shutdownContainer', () => {
    it('should shutdown container successfully', async () => {
      const shutdownResponse = {
        success: true,
        message: 'Container shutdown successfully',
        container_id: 1
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(shutdownResponse));

      const result = await containerApiService.shutdownContainer(1, {
        reason: 'Maintenance',
        force: false
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1/shutdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token'
        },
        body: JSON.stringify({
          reason: 'Maintenance',
          force: false
        }),
        signal: expect.any(AbortSignal)
      });

      expect(result).toEqual(shutdownResponse);
    });
  });

  describe('convenience methods', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue(createMockResponse({ containers: [mockContainer], pagination: {}, performance_metrics: {} }));
    });

    it('should search containers', async () => {
      await containerApiService.searchContainers('test container');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test%20container'),
        expect.any(Object)
      );
    });

    it('should get containers by type', async () => {
      await containerApiService.getContainersByType('physical');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('type=physical'),
        expect.any(Object)
      );
    });

    it('should get containers by status', async () => {
      await containerApiService.getContainersByStatus('active');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('status=active'),
        expect.any(Object)
      );
    });

    it('should get containers with alerts', async () => {
      await containerApiService.getContainersWithAlerts();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('alerts=true'),
        expect.any(Object)
      );
    });
  });

  describe('authentication handling', () => {
    it('should handle 401 unauthorized error', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ detail: 'Unauthorized' }, 401, false));

      await expect(containerApiService.getContainer(1)).rejects.toThrow();
    });

    it('should include authorization header when token is available', async () => {
      mockTokenStorage.getAccessToken.mockReturnValue('test-token');

      mockFetch.mockResolvedValueOnce(createMockResponse(mockContainer));

      await containerApiService.getContainer(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token'
          })
        })
      );
    });

    it('should not include authorization header when no token', async () => {
      mockTokenStorage.getAccessToken.mockReturnValue(null);

      mockFetch.mockResolvedValueOnce(createMockResponse(mockContainer));

      await containerApiService.getContainer(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String)
          })
        })
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(containerApiService.getContainer(1)).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('AbortError')), 100);
        })
      );

      await expect(containerApiService.getContainer(1)).rejects.toThrow();
    });

    it('should handle invalid JSON response', async () => {
      const badResponse = createMockResponse({});
      badResponse.json = () => Promise.reject(new Error('Invalid JSON'));
      mockFetch.mockResolvedValueOnce(badResponse);

      await expect(containerApiService.getContainer(1)).rejects.toThrow('Invalid JSON');
    });
  });
});