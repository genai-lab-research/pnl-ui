import { 
  verticalFarmService, 
  tenantService, 
  alertService, 
  deviceService, 
  metricsService 
} from '../index';

// Simple integration test without testing library dependencies
describe('API Services Integration', () => {
  test('services should be properly instantiated', () => {
    expect(verticalFarmService).toBeDefined();
    expect(tenantService).toBeDefined();
    expect(alertService).toBeDefined();
    expect(deviceService).toBeDefined();
    expect(metricsService).toBeDefined();
  });

  test('services should have expected methods', () => {
    // Container service methods
    expect(typeof verticalFarmService.getContainers).toBe('function');
    expect(typeof verticalFarmService.createContainer).toBe('function');
    expect(typeof verticalFarmService.updateContainer).toBe('function');
    expect(typeof verticalFarmService.deleteContainer).toBe('function');
    expect(typeof verticalFarmService.getContainerById).toBe('function');
    expect(typeof verticalFarmService.validateContainerName).toBe('function');

    // Tenant service methods
    expect(typeof tenantService.getTenants).toBe('function');
    expect(typeof tenantService.createTenant).toBe('function');
    expect(typeof tenantService.getTenantById).toBe('function');

    // Alert service methods
    expect(typeof alertService.getAlerts).toBe('function');
    expect(typeof alertService.createAlert).toBe('function');
    expect(typeof alertService.getAlertById).toBe('function');
    expect(typeof alertService.getAlertsByContainer).toBe('function');
    expect(typeof alertService.getActiveAlerts).toBe('function');

    // Device service methods
    expect(typeof deviceService.getDevices).toBe('function');
    expect(typeof deviceService.getDeviceById).toBe('function');
    expect(typeof deviceService.getDevicesByContainer).toBe('function');
    expect(typeof deviceService.getDevicesByStatus).toBe('function');

    // Metrics service methods
    expect(typeof metricsService.getMetricSnapshots).toBe('function');
    expect(typeof metricsService.getActivityLogs).toBe('function');
    expect(typeof metricsService.getMetricSnapshotsByContainer).toBe('function');
    expect(typeof metricsService.getActivityLogsByContainer).toBe('function');
  });

  test('services should have correct base URLs', () => {
    const expectedBaseUrl = '/api/v1';
    
    // All services should be configured with the same base URL
    expect((verticalFarmService as any).baseUrl).toBe(expectedBaseUrl);
    expect((tenantService as any).baseUrl).toBe(expectedBaseUrl);
    expect((alertService as any).baseUrl).toBe(expectedBaseUrl);
    expect((deviceService as any).baseUrl).toBe(expectedBaseUrl);
    expect((metricsService as any).baseUrl).toBe(expectedBaseUrl);
  });

  test('services should handle query string building', () => {
    const buildQueryString = (tenantService as any).buildQueryString;
    
    // Test empty filters
    expect(buildQueryString({})).toBe('');
    
    // Test single filter
    expect(buildQueryString({ name: 'test' })).toBe('?name=test');
    
    // Test multiple filters
    expect(buildQueryString({ name: 'test', active: true })).toBe('?name=test&active=true');
    
    // Test undefined/null values are filtered out
    expect(buildQueryString({ name: 'test', active: undefined, empty: null })).toBe('?name=test');
  });

  test('service methods should return promises', () => {
    // Mock the base service methods to avoid actual API calls
    const mockGet = jest.spyOn(tenantService as any, 'get');
    const mockPost = jest.spyOn(tenantService as any, 'post');
    
    mockGet.mockResolvedValue([]);
    mockPost.mockResolvedValue({ id: 1, name: 'test' });
    
    // Test that methods return promises
    expect(tenantService.getTenants()).toBeInstanceOf(Promise);
    expect(tenantService.createTenant({ name: 'test' })).toBeInstanceOf(Promise);
    
    // Clean up mocks
    mockGet.mockRestore();
    mockPost.mockRestore();
  });

  test('error handling should be consistent across services', () => {
    // Mock network error
    const mockGet = jest.spyOn(tenantService as any, 'get');
    mockGet.mockRejectedValue(new Error('Network error'));
    
    // Test error propagation
    expect(tenantService.getTenants()).rejects.toThrow('Network error');
    
    // Clean up mock
    mockGet.mockRestore();
  });
});