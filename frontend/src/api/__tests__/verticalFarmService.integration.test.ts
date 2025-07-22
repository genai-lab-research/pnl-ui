import { verticalFarmService } from '../verticalFarmService';
import { authService } from '../authService';
import { ContainerCreateRequest, TenantCreateRequest, AlertCreateRequest } from '../../types/verticalFarm';

// Integration tests require a running backend
describe('VerticalFarmService Integration Tests', () => {
  let authToken: string;
  let testContainerId: number;
  let testTenantId: number;

  beforeAll(async () => {
    // Authenticate before running tests
    try {
      await authService.login({
        username: 'testuser',
        password: 'testpassword'
      });
      authToken = authService.getStoredToken() || '';
    } catch (error) {
      console.warn('Authentication failed - skipping integration tests');
      return;
    }
  });

  beforeEach(() => {
    if (!authToken) {
      pending('Authentication required for integration tests');
    }
  });

  describe('Container Management Integration', () => {
    test('should create, read, update, and delete a container', async () => {
      // Create a test tenant first
      const tenantRequest: TenantCreateRequest = {
        name: `Test Tenant ${Date.now()}`
      };
      const tenant = await verticalFarmService.createTenant(tenantRequest);
      testTenantId = tenant.id;

      // Create container
      const containerRequest: ContainerCreateRequest = {
        name: `Test Container ${Date.now()}`,
        type: 'standard',
        tenant_id: testTenantId,
        purpose: 'integration testing',
        shadow_service_enabled: false,
        robotics_simulation_enabled: false,
        ecosystem_connected: false,
        notes: 'Created by integration test'
      };

      const createdContainer = await verticalFarmService.createContainer(containerRequest);
      testContainerId = createdContainer.id;

      expect(createdContainer.name).toBe(containerRequest.name);
      expect(createdContainer.type).toBe(containerRequest.type);
      expect(createdContainer.tenant_id).toBe(containerRequest.tenant_id);
      expect(createdContainer.id).toBeDefined();

      // Read container
      const retrievedContainer = await verticalFarmService.getContainerById(testContainerId);
      expect(retrievedContainer.id).toBe(testContainerId);
      expect(retrievedContainer.name).toBe(containerRequest.name);

      // Update container
      const updateRequest: ContainerCreateRequest = {
        ...containerRequest,
        name: `Updated Container ${Date.now()}`,
        purpose: 'updated integration testing'
      };

      const updatedContainer = await verticalFarmService.updateContainer(testContainerId, updateRequest);
      expect(updatedContainer.name).toBe(updateRequest.name);
      expect(updatedContainer.purpose).toBe(updateRequest.purpose);

      // Delete container
      const deleteResponse = await verticalFarmService.deleteContainer(testContainerId);
      expect(deleteResponse.message).toContain('deleted');

      // Verify deletion
      try {
        await verticalFarmService.getContainerById(testContainerId);
        fail('Container should have been deleted');
      } catch (error: any) {
        expect(error.status).toBe(404);
      }
    });

    test('should validate container name', async () => {
      const uniqueName = `Unique Container ${Date.now()}`;
      const validation = await verticalFarmService.validateContainerName({ name: uniqueName });
      expect(validation.is_valid).toBe(true);
    });

    test('should list containers with filters', async () => {
      const containers = await verticalFarmService.getContainers({ limit: 10 });
      expect(Array.isArray(containers)).toBe(true);
      expect(containers.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Tenant Management Integration', () => {
    test('should create and retrieve tenants', async () => {
      const tenantRequest: TenantCreateRequest = {
        name: `Integration Test Tenant ${Date.now()}`
      };

      const createdTenant = await verticalFarmService.createTenant(tenantRequest);
      expect(createdTenant.name).toBe(tenantRequest.name);
      expect(createdTenant.id).toBeDefined();

      const allTenants = await verticalFarmService.getTenants();
      expect(Array.isArray(allTenants)).toBe(true);
      expect(allTenants.some(t => t.id === createdTenant.id)).toBe(true);
    });
  });

  describe('Alert Management Integration', () => {
    test('should create and retrieve alerts', async () => {
      // Create a test container first
      const containerRequest: ContainerCreateRequest = {
        name: `Alert Test Container ${Date.now()}`,
        type: 'standard',
        purpose: 'alert testing'
      };

      const container = await verticalFarmService.createContainer(containerRequest);
      testContainerId = container.id;

      // Create alert
      const alertRequest: AlertCreateRequest = {
        container_id: testContainerId,
        description: 'Integration test alert',
        severity: 'medium',
        active: true,
        related_object: { test: true }
      };

      const createdAlert = await verticalFarmService.createAlert(alertRequest);
      expect(createdAlert.description).toBe(alertRequest.description);
      expect(createdAlert.severity).toBe(alertRequest.severity);
      expect(createdAlert.container_id).toBe(testContainerId);

      // Get alerts by container
      const alerts = await verticalFarmService.getAlerts({ container_id: testContainerId });
      expect(Array.isArray(alerts)).toBe(true);
      expect(alerts.some(a => a.id === createdAlert.id)).toBe(true);

      // Get active alerts
      const activeAlerts = await verticalFarmService.getAlerts({ active: true });
      expect(Array.isArray(activeAlerts)).toBe(true);
      expect(activeAlerts.some(a => a.id === createdAlert.id)).toBe(true);

      // Clean up
      await verticalFarmService.deleteContainer(testContainerId);
    });
  });

  describe('Device Management Integration', () => {
    test('should retrieve devices', async () => {
      const devices = await verticalFarmService.getDevices();
      expect(Array.isArray(devices)).toBe(true);
    });

    test('should filter devices by container', async () => {
      const devices = await verticalFarmService.getDevices({ container_id: 1 });
      expect(Array.isArray(devices)).toBe(true);
    });
  });

  describe('Metrics Integration', () => {
    test('should retrieve metric snapshots', async () => {
      const metrics = await verticalFarmService.getMetricSnapshots();
      expect(Array.isArray(metrics)).toBe(true);
    });

    test('should retrieve activity logs', async () => {
      const logs = await verticalFarmService.getActivityLogs();
      expect(Array.isArray(logs)).toBe(true);
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle 404 errors gracefully', async () => {
      try {
        await verticalFarmService.getContainerById(999999);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.status).toBe(404);
      }
    });

    test('should handle validation errors', async () => {
      try {
        await verticalFarmService.createContainer({} as ContainerCreateRequest);
        fail('Should have thrown a validation error');
      } catch (error: any) {
        expect(error.status).toBe(400);
      }
    });
  });

  afterAll(async () => {
    // Clean up any remaining test data
    if (testContainerId) {
      try {
        await verticalFarmService.deleteContainer(testContainerId);
      } catch (error) {
        console.warn('Failed to clean up test container:', error);
      }
    }
  });
});