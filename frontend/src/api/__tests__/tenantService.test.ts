/**
 * Tenant Service Tests
 * Tests for all tenant-related API operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TenantService, CreateTenantRequest } from '../tenantService';
import { Tenant } from '../../types/containers';
import { ApiError } from '../index';

// Mock fetch globally
global.fetch = vi.fn();

describe('TenantService', () => {
  let tenantService: TenantService;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    tenantService = TenantService.getInstance('/api/v1');
    mockFetch = vi.mocked(global.fetch);
    mockFetch.mockClear();
  });

  describe('getAllTenants', () => {
    it('should fetch all tenants successfully', async () => {
      const mockTenants: Tenant[] = [
        { id: 1, name: 'Farm Alpha' },
        { id: 2, name: 'Farm Beta' }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTenants,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await tenantService.getAllTenants();

      expect(result).toEqual(mockTenants);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/tenants/',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ detail: 'Server error' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await expect(tenantService.getAllTenants()).rejects.toThrow(ApiError);
    });
  });

  describe('createTenant', () => {
    it('should create a new tenant successfully', async () => {
      const createRequest: CreateTenantRequest = {
        name: 'New Farm'
      };

      const mockCreatedTenant: Tenant = {
        id: 3,
        name: 'New Farm'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatedTenant,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await tenantService.createTenant(createRequest);

      expect(result).toEqual(mockCreatedTenant);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/tenants/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(createRequest),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle validation errors', async () => {
      const createRequest: CreateTenantRequest = {
        name: ''
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        json: async () => ({
          detail: [
            {
              loc: ['name'],
              msg: 'field required',
              type: 'value_error.missing'
            }
          ]
        }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await expect(tenantService.createTenant(createRequest)).rejects.toThrow(ApiError);
    });
  });

  describe('getTenantById', () => {
    it('should fetch tenant by ID successfully', async () => {
      const mockTenant: Tenant = {
        id: 1,
        name: 'Farm Alpha'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTenant,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await tenantService.getTenantById(1);

      expect(result).toEqual(mockTenant);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/tenants/1',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should handle not found errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ detail: 'Tenant not found' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await expect(tenantService.getTenantById(999)).rejects.toThrow(ApiError);
    });
  });

  describe('updateTenant', () => {
    it('should update tenant successfully', async () => {
      const updateData = { name: 'Updated Farm Name' };
      const mockUpdatedTenant: Tenant = {
        id: 1,
        name: 'Updated Farm Name'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedTenant,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await tenantService.updateTenant(1, updateData);

      expect(result).toEqual(mockUpdatedTenant);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/tenants/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      );
    });
  });

  describe('deleteTenant', () => {
    it('should delete tenant successfully', async () => {
      const mockResponse = { message: 'Tenant deleted successfully' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await tenantService.deleteTenant(1);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/tenants/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('Authentication Integration', () => {
    it('should include authentication headers when token is available', async () => {
      // Mock token storage
      const mockToken = 'mock-jwt-token';
      vi.doMock('../../utils/tokenStorage', () => ({
        tokenStorage: {
          getAccessToken: () => mockToken
        }
      }));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await tenantService.getAllTenants();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/tenants/',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
    });

    it('should handle 401 unauthorized responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ detail: 'Token expired' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await expect(tenantService.getAllTenants()).rejects.toThrow(ApiError);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(tenantService.getAllTenants()).rejects.toThrow(ApiError);
    });

    it('should handle empty responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => { throw new Error('No content'); },
        headers: new Headers(),
      } as Response);

      const result = await tenantService.getAllTenants();
      expect(result).toEqual({});
    });

    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); },
        text: async () => 'Invalid response',
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await expect(tenantService.getAllTenants()).rejects.toThrow(ApiError);
    });
  });
});
