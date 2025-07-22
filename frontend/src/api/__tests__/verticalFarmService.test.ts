import { verticalFarmService } from '../verticalFarmService';
import { Container, ContainerCreateRequest, Tenant, Alert, Device } from '../../types/verticalFarm';

// Mock the base service
jest.mock('../baseService');

describe('VerticalFarmService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Container Management', () => {
    const mockContainer: Container = {
      id: 1,
      name: 'Test Container',
      type: 'standard',
      tenant_id: 1,
      purpose: 'testing',
      status: 'active',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    };

    const mockContainerRequest: ContainerCreateRequest = {
      name: 'Test Container',
      type: 'standard',
      tenant_id: 1,
      purpose: 'testing',
      shadow_service_enabled: false,
      robotics_simulation_enabled: false,
      ecosystem_connected: false
    };

    test('createContainer should create a new container', async () => {
      const mockPost = jest.spyOn(verticalFarmService as any, 'post');
      mockPost.mockResolvedValue(mockContainer);

      const result = await verticalFarmService.createContainer(mockContainerRequest);

      expect(mockPost).toHaveBeenCalledWith('/containers/', mockContainerRequest);
      expect(result).toEqual(mockContainer);
    });

    test('getContainers should return list of containers', async () => {
      const mockGet = jest.spyOn(verticalFarmService as any, 'get');
      mockGet.mockResolvedValue([mockContainer]);

      const result = await verticalFarmService.getContainers();

      expect(mockGet).toHaveBeenCalledWith('/containers/');
      expect(result).toEqual([mockContainer]);
    });

    test('getContainers with filters should build query string', async () => {
      const mockGet = jest.spyOn(verticalFarmService as any, 'get');
      const mockBuildQueryString = jest.spyOn(verticalFarmService as any, 'buildQueryString');
      mockBuildQueryString.mockReturnValue('?tenant_id=1&status=active');
      mockGet.mockResolvedValue([mockContainer]);

      const filters = { tenant_id: 1, status: 'active' };
      const result = await verticalFarmService.getContainers(filters);

      expect(mockBuildQueryString).toHaveBeenCalledWith(filters);
      expect(mockGet).toHaveBeenCalledWith('/containers/?tenant_id=1&status=active');
      expect(result).toEqual([mockContainer]);
    });

    test('getContainerById should return specific container', async () => {
      const mockGet = jest.spyOn(verticalFarmService as any, 'get');
      mockGet.mockResolvedValue(mockContainer);

      const result = await verticalFarmService.getContainerById(1);

      expect(mockGet).toHaveBeenCalledWith('/containers/1');
      expect(result).toEqual(mockContainer);
    });

    test('updateContainer should update existing container', async () => {
      const mockPut = jest.spyOn(verticalFarmService as any, 'put');
      mockPut.mockResolvedValue(mockContainer);

      const result = await verticalFarmService.updateContainer(1, mockContainerRequest);

      expect(mockPut).toHaveBeenCalledWith('/containers/1', mockContainerRequest);
      expect(result).toEqual(mockContainer);
    });

    test('deleteContainer should delete container', async () => {
      const mockDelete = jest.spyOn(verticalFarmService as any, 'delete');
      const mockResponse = { message: 'Container deleted successfully' };
      mockDelete.mockResolvedValue(mockResponse);

      const result = await verticalFarmService.deleteContainer(1);

      expect(mockDelete).toHaveBeenCalledWith('/containers/1');
      expect(result).toEqual(mockResponse);
    });

    test('validateContainerName should validate name', async () => {
      const mockPost = jest.spyOn(verticalFarmService as any, 'post');
      const mockResponse = { is_valid: true };
      mockPost.mockResolvedValue(mockResponse);

      const result = await verticalFarmService.validateContainerName({ name: 'Test Container' });

      expect(mockPost).toHaveBeenCalledWith('/containers/validate-name', { name: 'Test Container' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Tenant Management', () => {
    const mockTenant: Tenant = {
      id: 1,
      name: 'Test Tenant'
    };

    test('getTenants should return list of tenants', async () => {
      const mockGet = jest.spyOn(verticalFarmService as any, 'get');
      mockGet.mockResolvedValue([mockTenant]);

      const result = await verticalFarmService.getTenants();

      expect(mockGet).toHaveBeenCalledWith('/tenants/');
      expect(result).toEqual([mockTenant]);
    });

    test('createTenant should create new tenant', async () => {
      const mockPost = jest.spyOn(verticalFarmService as any, 'post');
      mockPost.mockResolvedValue(mockTenant);

      const result = await verticalFarmService.createTenant({ name: 'Test Tenant' });

      expect(mockPost).toHaveBeenCalledWith('/tenants/', { name: 'Test Tenant' });
      expect(result).toEqual(mockTenant);
    });
  });

  describe('Alert Management', () => {
    const mockAlert: Alert = {
      id: 1,
      container_id: 1,
      description: 'Test alert',
      severity: 'medium',
      active: true,
      created_at: '2023-01-01T00:00:00Z'
    };

    test('getAlerts should return list of alerts', async () => {
      const mockGet = jest.spyOn(verticalFarmService as any, 'get');
      mockGet.mockResolvedValue([mockAlert]);

      const result = await verticalFarmService.getAlerts();

      expect(mockGet).toHaveBeenCalledWith('/alerts/');
      expect(result).toEqual([mockAlert]);
    });

    test('createAlert should create new alert', async () => {
      const mockPost = jest.spyOn(verticalFarmService as any, 'post');
      const alertRequest = {
        container_id: 1,
        description: 'Test alert',
        severity: 'medium',
        active: true
      };
      mockPost.mockResolvedValue(mockAlert);

      const result = await verticalFarmService.createAlert(alertRequest);

      expect(mockPost).toHaveBeenCalledWith('/alerts/', alertRequest);
      expect(result).toEqual(mockAlert);
    });
  });

  describe('Device Management', () => {
    const mockDevice: Device = {
      id: 1,
      container_id: 1,
      name: 'Test Device',
      model: 'Model X',
      serial_number: 'SN123456',
      status: 'active',
      last_active_at: '2023-01-01T00:00:00Z'
    };

    test('getDevices should return list of devices', async () => {
      const mockGet = jest.spyOn(verticalFarmService as any, 'get');
      mockGet.mockResolvedValue([mockDevice]);

      const result = await verticalFarmService.getDevices();

      expect(mockGet).toHaveBeenCalledWith('/devices/');
      expect(result).toEqual([mockDevice]);
    });

    test('getDevices with filters should build query string', async () => {
      const mockGet = jest.spyOn(verticalFarmService as any, 'get');
      const mockBuildQueryString = jest.spyOn(verticalFarmService as any, 'buildQueryString');
      mockBuildQueryString.mockReturnValue('?container_id=1&status=active');
      mockGet.mockResolvedValue([mockDevice]);

      const filters = { container_id: 1, status: 'active' };
      const result = await verticalFarmService.getDevices(filters);

      expect(mockBuildQueryString).toHaveBeenCalledWith(filters);
      expect(mockGet).toHaveBeenCalledWith('/devices/?container_id=1&status=active');
      expect(result).toEqual([mockDevice]);
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      const mockGet = jest.spyOn(verticalFarmService as any, 'get');
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(verticalFarmService.getContainers()).rejects.toThrow('Network error');
    });

    test('should handle API errors', async () => {
      const mockPost = jest.spyOn(verticalFarmService as any, 'post');
      const apiError = {
        message: 'Validation failed',
        status: 400,
        details: { field: 'name is required' }
      };
      mockPost.mockRejectedValue(apiError);

      await expect(verticalFarmService.createContainer({} as ContainerCreateRequest)).rejects.toEqual(apiError);
    });
  });
});