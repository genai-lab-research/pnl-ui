import { ContainerService } from '../containerService';
import { Container, CreateContainerRequest, UpdateContainerRequest } from '../../shared/types/containers';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ContainerService', () => {
  let service: ContainerService;

  beforeEach(() => {
    service = new ContainerService('/api');
    jest.clearAllMocks();
  });

  describe('listContainers', () => {
    const mockContainers: Container[] = [
      {
        id: '1',
        type: 'physical',
        name: 'Test Container 1',
        tenant: 'tenant1',
        purpose: 'development',
        location: { city: 'New York', country: 'USA' },
        status: 'active',
        created: '2023-01-01T00:00:00Z',
        modified: '2023-01-01T00:00:00Z',
        has_alert: false,
        shadow_service_enabled: true,
        ecosystem_connected: true
      }
    ];

    it('should fetch containers without filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockContainers),
      } as Response);

      const result = await service.listContainers();

      expect(mockFetch).toHaveBeenCalledWith('/api/containers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result.data).toEqual(mockContainers);
      expect(result.error).toBeUndefined();
    });

    it('should fetch containers with filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockContainers),
      } as Response);

      const filters = {
        search: 'test',
        type: 'physical' as const,
        tenant: 'tenant1',
        purpose: 'development' as const,
        status: 'active' as const,
        has_alerts: false
      };

      const result = await service.listContainers(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/containers?search=test&type=physical&tenant=tenant1&purpose=development&status=active&has_alerts=false',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(result.data).toEqual(mockContainers);
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ detail: 'Not found' }),
      } as Response);

      const result = await service.listContainers();

      expect(result.error).toEqual({
        detail: 'Not found',
        status_code: 404
      });
      expect(result.data).toBeUndefined();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.listContainers();

      expect(result.error).toEqual({
        detail: 'Network error',
        status_code: 0
      });
    });
  });

  describe('getContainer', () => {
    const mockContainer: Container = {
      id: '1',
      type: 'physical',
      name: 'Test Container',
      tenant: 'tenant1',
      purpose: 'development',
      location: { city: 'New York', country: 'USA' },
      status: 'active',
      created: '2023-01-01T00:00:00Z',
      modified: '2023-01-01T00:00:00Z',
      has_alert: false,
      shadow_service_enabled: true,
      ecosystem_connected: true
    };

    it('should fetch a single container', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockContainer),
      } as Response);

      const result = await service.getContainer('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/containers/1', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result.data).toEqual(mockContainer);
    });

    it('should handle container not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ detail: 'Container not found' }),
      } as Response);

      const result = await service.getContainer('999');

      expect(result.error).toEqual({
        detail: 'Container not found',
        status_code: 404
      });
    });
  });

  describe('createContainer', () => {
    const createRequest: CreateContainerRequest = {
      name: 'New Container',
      tenant: 'tenant1',
      type: 'physical',
      purpose: 'development',
      location: 'New York, USA',
      shadow_service_enabled: true,
      connect_to_other_systems: true
    };

    const createdContainer: Container = {
      id: '2',
      type: 'physical',
      name: 'New Container',
      tenant: 'tenant1',
      purpose: 'development',
      location: { city: 'New York', country: 'USA' },
      status: 'created',
      created: '2023-01-01T00:00:00Z',
      modified: '2023-01-01T00:00:00Z',
      has_alert: false,
      shadow_service_enabled: true,
      ecosystem_connected: true
    };

    it('should create a new container', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdContainer),
      } as Response);

      const result = await service.createContainer(createRequest);

      expect(mockFetch).toHaveBeenCalledWith('/api/containers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createRequest),
      });
      expect(result.data).toEqual(createdContainer);
    });

    it('should handle validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ detail: 'Validation error' }),
      } as Response);

      const result = await service.createContainer(createRequest);

      expect(result.error).toEqual({
        detail: 'Validation error',
        status_code: 422
      });
    });
  });

  describe('updateContainer', () => {
    const updateRequest: UpdateContainerRequest = {
      name: 'Updated Container',
      status: 'maintenance'
    };

    const updatedContainer: Container = {
      id: '1',
      type: 'physical',
      name: 'Updated Container',
      tenant: 'tenant1',
      purpose: 'development',
      location: { city: 'New York', country: 'USA' },
      status: 'maintenance',
      created: '2023-01-01T00:00:00Z',
      modified: '2023-01-02T00:00:00Z',
      has_alert: false,
      shadow_service_enabled: true,
      ecosystem_connected: true
    };

    it('should update a container', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedContainer),
      } as Response);

      const result = await service.updateContainer('1', updateRequest);

      expect(mockFetch).toHaveBeenCalledWith('/api/containers/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateRequest),
      });
      expect(result.data).toEqual(updatedContainer);
    });

    it('should handle update errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ detail: 'Container not found' }),
      } as Response);

      const result = await service.updateContainer('999', updateRequest);

      expect(result.error).toEqual({
        detail: 'Container not found',
        status_code: 404
      });
    });
  });

  describe('deleteContainer', () => {
    it('should delete a container successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);

      const result = await service.deleteContainer('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/containers/1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result.data).toBeUndefined();
      expect(result.error).toBeUndefined();
    });

    it('should handle delete errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ detail: 'Container not found' }),
      } as Response);

      const result = await service.deleteContainer('999');

      expect(result.error).toEqual({
        detail: 'Container not found',
        status_code: 404
      });
    });
  });

  describe('error handling', () => {
    it('should handle malformed JSON errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      } as Response);

      const result = await service.listContainers();

      expect(result.error).toEqual({
        detail: 'Unknown error',
        status_code: 500
      });
    });

    it('should handle fetch exceptions', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

      const result = await service.listContainers();

      expect(result.error).toEqual({
        detail: 'Fetch failed',
        status_code: 0
      });
    });
  });
});