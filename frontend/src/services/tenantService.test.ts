import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import tenantService from './tenantService';

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
      tenants: '/tenants',
    }
  }
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Tenant Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getTenants', () => {
    it('should fetch all tenants successfully', async () => {
      const mockTenantList = {
        total: 5,
        results: [
          { id: 'tenant-001', name: 'Skybridge Farms' },
          { id: 'tenant-002', name: 'EcoGrow Solutions' },
          { id: 'tenant-003', name: 'UrbanLeaf Inc.' },
          { id: 'tenant-004', name: 'AgroTech Research' },
          { id: 'tenant-005', name: 'FarmFusion Labs' }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTenantList,
      });

      const result = await tenantService.getTenants();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/tenants',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        })
      );

      expect(result).toEqual(mockTenantList);
      expect(result.total).toBe(5);
      expect(result.results).toHaveLength(5);
      expect(result.results[0]).toHaveProperty('id');
      expect(result.results[0]).toHaveProperty('name');
      expect(result.results[0].id).toBe('tenant-001');
      expect(result.results[0].name).toBe('Skybridge Farms');
    });

    it('should handle empty tenant list', async () => {
      const mockEmptyTenantList = {
        total: 0,
        results: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEmptyTenantList,
      });

      const result = await tenantService.getTenants();

      expect(result).toEqual(mockEmptyTenantList);
      expect(result.total).toBe(0);
      expect(result.results).toHaveLength(0);
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Database connection failed',
      });

      await expect(tenantService.getTenants()).rejects.toThrow(
        'API request failed: 500 Internal Server Error. Database connection failed'
      );
    });

    it('should handle unauthorized access', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Authentication required',
      });

      await expect(tenantService.getTenants()).rejects.toThrow(
        'API request failed: 401 Unauthorized. Authentication required'
      );
    });

    it('should handle forbidden access', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: async () => 'Insufficient permissions',
      });

      await expect(tenantService.getTenants()).rejects.toThrow(
        'API request failed: 403 Forbidden. Insufficient permissions'
      );
    });

    it('should handle not found errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Tenants endpoint not found',
      });

      await expect(tenantService.getTenants()).rejects.toThrow(
        'API request failed: 404 Not Found. Tenants endpoint not found'
      );
    });
  });

  describe('Network error handling', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

      await expect(tenantService.getTenants()).rejects.toThrow(
        'Network error: Unable to connect to the API server. Please check if the backend is running.'
      );
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));

      await expect(tenantService.getTenants()).rejects.toThrow(
        'AbortError'
      );
    });

    it('should handle DNS resolution failures', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('NetworkError when attempting to fetch resource.'));

      await expect(tenantService.getTenants()).rejects.toThrow(
        'Network error: Unable to connect to the API server. Please check if the backend is running.'
      );
    });
  });

  describe('Response validation', () => {
    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token < in JSON at position 0');
        },
      });

      await expect(tenantService.getTenants()).rejects.toThrow(
        'Unexpected token < in JSON at position 0'
      );
    });

    it('should handle non-array responses', async () => {
      const mockInvalidResponse = { message: 'This should be an array' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockInvalidResponse,
      });

      const result = await tenantService.getTenants();

      // Service should return whatever the API returns, letting the caller handle validation
      expect(result).toEqual(mockInvalidResponse);
    });

    it('should handle tenants with missing properties', async () => {
      const mockIncompleteTenants = [
        { id: '1', name: 'Complete Tenant' },
        { id: '2' }, // Missing name
        { name: 'Missing ID Tenant' }, // Missing id
        { id: '', name: '' }, // Empty strings
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockIncompleteTenants,
      });

      const result = await tenantService.getTenants();

      expect(result).toEqual(mockIncompleteTenants);
      expect(result).toHaveLength(4);
      // Service returns data as-is, validation should happen at UI level
    });

    it('should handle tenants with additional properties', async () => {
      const mockTenantsWithExtraProps = [
        { 
          id: '1', 
          name: 'Acme Corp',
          description: 'Large corporation',
          created_at: '2024-01-01T00:00:00Z',
          active: true
        },
        { 
          id: '2', 
          name: 'TechStart Inc',
          email: 'contact@techstart.com',
          phone: '+1-555-0123'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTenantsWithExtraProps,
      });

      const result = await tenantService.getTenants();

      expect(result).toEqual(mockTenantsWithExtraProps);
      expect(result[0]).toHaveProperty('description');
      expect(result[1]).toHaveProperty('email');
    });
  });

  describe('Content-Type handling', () => {
    it('should send correct headers', async () => {
      const mockTenants = [{ id: '1', name: 'Test Tenant' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTenants,
      });

      await tenantService.getTenants();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/tenants',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        })
      );
    });

    it('should handle non-JSON content types gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 415,
        statusText: 'Unsupported Media Type',
        text: async () => 'Content-Type application/json expected',
      });

      await expect(tenantService.getTenants()).rejects.toThrow(
        'API request failed: 415 Unsupported Media Type. Content-Type application/json expected'
      );
    });
  });

  describe('Performance and caching', () => {
    it('should make fresh requests each time (no caching)', async () => {
      const mockTenants = [{ id: '1', name: 'Test Tenant' }];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockTenants,
      });

      // Make multiple calls
      await tenantService.getTenants();
      await tenantService.getTenants();
      await tenantService.getTenants();

      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent requests independently', async () => {
      const mockTenants = [{ id: '1', name: 'Test Tenant' }];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockTenants,
      });

      // Make concurrent calls
      const promises = [
        tenantService.getTenants(),
        tenantService.getTenants(),
        tenantService.getTenants()
      ];

      const results = await Promise.all(promises);

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual(mockTenants);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle very large tenant lists', async () => {
      // Generate a large list of tenants
      const largeTenantList = Array.from({ length: 1000 }, (_, i) => ({
        id: `tenant-${i + 1}`,
        name: `Tenant ${i + 1}`
      }));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => largeTenantList,
      });

      const result = await tenantService.getTenants();

      expect(result).toHaveLength(1000);
      expect(result[0].id).toBe('tenant-1');
      expect(result[999].id).toBe('tenant-1000');
    });

    it('should handle special characters in tenant names', async () => {
      const mockTenants = [
        { id: '1', name: 'Acme Corp & Associates' },
        { id: '2', name: 'TechStart Inc. (Subsidiary)' },
        { id: '3', name: 'Grün-Grow GmbH' },
        { id: '4', name: '農業テック株式会社' },
        { id: '5', name: 'Ферма "Зеленый мир"' }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTenants,
      });

      const result = await tenantService.getTenants();

      expect(result).toEqual(mockTenants);
      expect(result[2].name).toBe('Grün-Grow GmbH');
      expect(result[3].name).toBe('農業テック株式会社');
      expect(result[4].name).toBe('Ферма "Зеленый мир"');
    });
  });
});