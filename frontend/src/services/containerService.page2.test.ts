import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import containerService from './containerService';
import { ContainerFormData, ContainerResponse } from '../shared/types/containers';
import config from './config';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockContainerFormData: ContainerFormData = {
  name: 'Test Container',
  tenant: 'tenant-001',
  type: 'physical',
  purpose: 'Production',
  seed_types: ['seed-001', 'seed-002'],
  location: 'Lviv, Ukraine',
  notes: 'Test container for production',
  shadow_service_enabled: true,
  connect_to_other_systems: false
};

const mockContainerResponse: ContainerResponse = {
  id: 'container-123',
  name: 'Test Container',
  type: 'PHYSICAL',
  tenant_name: 'Skybridge Farms',
  purpose: 'Production',
  location_city: 'Lviv',
  location_country: 'Ukraine',
  status: 'CREATED',
  created_at: '2023-07-25T10:30:00Z',
  updated_at: '2023-07-25T10:30:00Z',
  has_alerts: false,
  shadow_service_enabled: true,
  ecosystem_connected: false
};

describe('Container Service - Page 2 (Create Container Form)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset config to enable real API calls
    vi.spyOn(config.api, 'enableMockFallback', 'get').mockReturnValue(false);
    vi.spyOn(config.api, 'isDevelopment', 'get').mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createContainerFromForm', () => {
    it('should create container from form data successfully', async () => {
      const expectedResponse = mockContainerResponse;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => expectedResponse,
      });

      const result = await containerService.createContainerFromForm(mockContainerFormData);

      expect(mockFetch).toHaveBeenCalledWith(
        `${config.api.baseUrl}${config.endpoints.containers}`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
          body: JSON.stringify(mockContainerFormData),
        })
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        text: async () => JSON.stringify({
          detail: [
            { loc: ['name'], msg: 'field required', type: 'value_error.missing' }
          ]
        }),
      });

      await expect(containerService.createContainerFromForm(mockContainerFormData)).rejects.toThrow(
        'API request failed: 422 Unprocessable Entity'
      );
    });

    it('should handle server errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Database connection failed',
      });

      await expect(containerService.createContainerFromForm(mockContainerFormData)).rejects.toThrow(
        'API request failed: 500 Internal Server Error. Database connection failed'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

      await expect(containerService.createContainerFromForm(mockContainerFormData)).rejects.toThrow(
        'Network error: Unable to connect to the API server. Please check if the backend is running.'
      );
    });

    it('should fall back to mock data when API is unavailable and mock fallback is enabled', async () => {
      // Enable mock fallback
      vi.spyOn(config.api, 'enableMockFallback', 'get').mockReturnValue(true);
      vi.spyOn(config.api, 'isDevelopment', 'get').mockReturnValue(true);
      
      mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

      const result = await containerService.createContainerFromForm(mockContainerFormData);

      expect(result).toEqual({
        id: 'container-123',
        name: 'farm-container-04',
        type: 'PHYSICAL',
        tenant_name: 'Skybridge Farms',
        purpose: 'Production',
        location_city: 'Lviv',
        location_country: 'Ukraine',
        status: 'CREATED',
        created_at: '2023-07-25T10:30:00Z',
        updated_at: '2023-07-25T10:30:00Z',
        has_alerts: false,
        shadow_service_enabled: true,
        ecosystem_connected: true
      });
    });

    it('should handle timeout errors', async () => {
      const abortError = new DOMException('The operation was aborted', 'AbortError');
      mockFetch.mockRejectedValueOnce(abortError);

      await expect(containerService.createContainerFromForm(mockContainerFormData)).rejects.toThrow(abortError);
    });

    it('should validate request body format', async () => {
      const expectedResponse = mockContainerResponse;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => expectedResponse,
      });

      await containerService.createContainerFromForm(mockContainerFormData);

      const callArgs = mockFetch.mock.calls[0];
      const requestOptions = callArgs[1];
      const requestBody = JSON.parse(requestOptions.body);

      // Validate that all required fields are present
      expect(requestBody).toHaveProperty('name');
      expect(requestBody).toHaveProperty('tenant');
      expect(requestBody).toHaveProperty('type');
      expect(requestBody).toHaveProperty('purpose');
      expect(requestBody).toHaveProperty('seed_types');
      expect(requestBody).toHaveProperty('location');
      expect(requestBody).toHaveProperty('shadow_service_enabled');
      expect(requestBody).toHaveProperty('connect_to_other_systems');

      // Validate field types
      expect(typeof requestBody.name).toBe('string');
      expect(typeof requestBody.tenant).toBe('string');
      expect(['physical', 'virtual']).toContain(requestBody.type);
      expect(typeof requestBody.purpose).toBe('string');
      expect(Array.isArray(requestBody.seed_types)).toBe(true);
      expect(typeof requestBody.location).toBe('string');
      expect(typeof requestBody.shadow_service_enabled).toBe('boolean');
      expect(typeof requestBody.connect_to_other_systems).toBe('boolean');
    });

    it('should validate response format', async () => {
      const expectedResponse = mockContainerResponse;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => expectedResponse,
      });

      const result = await containerService.createContainerFromForm(mockContainerFormData);

      // Validate response structure
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('tenant_name');
      expect(result).toHaveProperty('purpose');
      expect(result).toHaveProperty('location_city');
      expect(result).toHaveProperty('location_country');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('created_at');
      expect(result).toHaveProperty('updated_at');
      expect(result).toHaveProperty('has_alerts');
      expect(result).toHaveProperty('shadow_service_enabled');
      expect(result).toHaveProperty('ecosystem_connected');

      // Validate field types
      expect(typeof result.id).toBe('string');
      expect(typeof result.name).toBe('string');
      expect(['PHYSICAL', 'VIRTUAL']).toContain(result.type);
      expect(typeof result.tenant_name).toBe('string');
      expect(typeof result.purpose).toBe('string');
      expect(typeof result.location_city).toBe('string');
      expect(typeof result.location_country).toBe('string');
      expect(result.status).toBe('CREATED');
      expect(typeof result.created_at).toBe('string');
      expect(typeof result.updated_at).toBe('string');
      expect(typeof result.has_alerts).toBe('boolean');
      expect(typeof result.shadow_service_enabled).toBe('boolean');
      expect(typeof result.ecosystem_connected).toBe('boolean');
    });

    it('should handle empty form data gracefully', async () => {
      const emptyFormData: ContainerFormData = {
        name: '',
        tenant: '',
        type: 'physical',
        purpose: '',
        seed_types: [],
        location: '',
        notes: '',
        shadow_service_enabled: false,
        connect_to_other_systems: false
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        text: async () => 'Validation error: name field is required',
      });

      await expect(containerService.createContainerFromForm(emptyFormData)).rejects.toThrow(
        'API request failed: 422 Unprocessable Entity'
      );
    });

    it('should handle large seed types array', async () => {
      const formDataWithManySeedTypes: ContainerFormData = {
        ...mockContainerFormData,
        seed_types: Array.from({ length: 20 }, (_, i) => `seed-${String(i + 1).padStart(3, '0')}`)
      };

      const expectedResponse = mockContainerResponse;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => expectedResponse,
      });

      const result = await containerService.createContainerFromForm(formDataWithManySeedTypes);

      expect(result).toEqual(expectedResponse);
      
      const callArgs = mockFetch.mock.calls[0];
      const requestOptions = callArgs[1];
      const requestBody = JSON.parse(requestOptions.body);
      
      expect(requestBody.seed_types).toHaveLength(20);
    });
  });
});