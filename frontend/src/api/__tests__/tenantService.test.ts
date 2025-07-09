import { tenantService } from '../tenantService';
import { Tenant, TenantCreateRequest } from '../../types/verticalFarm';

// Mock the base service
jest.mock('../baseService');

describe('TenantService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTenant: Tenant = {
    id: 1,
    name: 'Test Tenant'
  };

  const mockTenantRequest: TenantCreateRequest = {
    name: 'Test Tenant'
  };

  describe('getTenants', () => {
    test('should return list of tenants', async () => {
      const mockGet = jest.spyOn(tenantService as any, 'get');
      mockGet.mockResolvedValue([mockTenant]);

      const result = await tenantService.getTenants();

      expect(mockGet).toHaveBeenCalledWith('/tenants/');
      expect(result).toEqual([mockTenant]);
    });

    test('should handle empty tenant list', async () => {
      const mockGet = jest.spyOn(tenantService as any, 'get');
      mockGet.mockResolvedValue([]);

      const result = await tenantService.getTenants();

      expect(mockGet).toHaveBeenCalledWith('/tenants/');
      expect(result).toEqual([]);
    });
  });

  describe('createTenant', () => {
    test('should create new tenant', async () => {
      const mockPost = jest.spyOn(tenantService as any, 'post');
      mockPost.mockResolvedValue(mockTenant);

      const result = await tenantService.createTenant(mockTenantRequest);

      expect(mockPost).toHaveBeenCalledWith('/tenants/', mockTenantRequest);
      expect(result).toEqual(mockTenant);
    });

    test('should handle validation errors', async () => {
      const mockPost = jest.spyOn(tenantService as any, 'post');
      const error = { message: 'Name is required', status: 400 };
      mockPost.mockRejectedValue(error);

      await expect(tenantService.createTenant({ name: '' })).rejects.toEqual(error);
    });
  });

  describe('getTenantById', () => {
    test('should return specific tenant', async () => {
      const mockGet = jest.spyOn(tenantService as any, 'get');
      mockGet.mockResolvedValue(mockTenant);

      const result = await tenantService.getTenantById(1);

      expect(mockGet).toHaveBeenCalledWith('/tenants/1');
      expect(result).toEqual(mockTenant);
    });

    test('should handle not found error', async () => {
      const mockGet = jest.spyOn(tenantService as any, 'get');
      const error = { message: 'Tenant not found', status: 404 };
      mockGet.mockRejectedValue(error);

      await expect(tenantService.getTenantById(999)).rejects.toEqual(error);
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      const mockGet = jest.spyOn(tenantService as any, 'get');
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(tenantService.getTenants()).rejects.toThrow('Network error');
    });

    test('should handle server errors', async () => {
      const mockPost = jest.spyOn(tenantService as any, 'post');
      const error = { message: 'Internal server error', status: 500 };
      mockPost.mockRejectedValue(error);

      await expect(tenantService.createTenant(mockTenantRequest)).rejects.toEqual(error);
    });
  });
});