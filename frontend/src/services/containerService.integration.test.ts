import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import containerService from './containerService';
import config from './config';
import { 
  TEST_CONFIG, 
  isBackendAvailable, 
  skipIfBackendUnavailable,
  generateTestContainer,
  validateContainerStructure,
  validateMetricsStructure,
  validateCropStructure,
  validateActivityStructure
} from '../test/testEnv';

// These are integration tests that connect to the real backend
// The backend should be running at http://localhost:8000 for these tests to pass

// Override config to use real backend
const originalBaseUrl = config.api.baseUrl;
const originalMockFallback = config.api.enableMockFallback;

describe('Container Service - Real Backend Integration', () => {
  beforeAll(() => {
    // Configure to use real backend
    vi.spyOn(config.api, 'baseUrl', 'get').mockReturnValue(TEST_CONFIG.API_BASE_URL);
    vi.spyOn(config.api, 'enableMockFallback', 'get').mockReturnValue(false);
  });

  afterAll(() => {
    // Restore original config
    vi.spyOn(config.api, 'baseUrl', 'get').mockReturnValue(originalBaseUrl);
    vi.spyOn(config.api, 'enableMockFallback', 'get').mockReturnValue(originalMockFallback);
  });

  describe('Backend Connectivity', () => {
    it('should connect to the backend server', async () => {
      try {
        const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/containers`);
        expect(response.status).toBeLessThan(500); // Should not be a server error
      } catch (error) {
        console.warn('Backend not available, skipping integration tests');
        console.warn('To run integration tests, start the backend server with: cd backend && python -m uvicorn app.main:app --reload');
        return;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);
  });

  describe('Container CRUD Operations', () => {
    let createdContainerId: string | null = null;

    afterEach(async () => {
      // Clean up created containers
      if (createdContainerId) {
        try {
          await containerService.deleteContainer(createdContainerId);
        } catch (error) {
          console.warn('Failed to clean up test container:', error);
        }
        createdContainerId = null;
      }
    });

    it('should fetch containers list', async () => {
      try {
        const result = await containerService.getContainers(0, 10);
        
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('count');
        expect(Array.isArray(result.data)).toBe(true);
        expect(typeof result.count).toBe('number');
        
        // Validate container structure if data exists
        if (result.data.length > 0) {
          const container = result.data[0];
          expect(container).toHaveProperty('id');
          expect(container).toHaveProperty('name');
          expect(container).toHaveProperty('type');
          expect(container).toHaveProperty('status');
          expect(['PHYSICAL', 'VIRTUAL']).toContain(container.type);
          expect(['CREATED', 'ACTIVE', 'MAINTENANCE', 'INACTIVE']).toContain(container.status);
        }
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);

    it('should create a new container', async () => {
      const newContainerData = {
        name: `test-container-${Date.now()}`,
        type: 'PHYSICAL' as const,
        tenant: 'test-tenant',
        purpose: 'Development' as const,
        location: {
          city: 'Test City',
          country: 'Test Country',
          address: 'Test Address'
        },
        status: 'ACTIVE' as const,
        creator: 'Test User',
        seed_types: ['test-seed'],
        notes: 'Integration test container',
        shadow_service_enabled: false,
        ecosystem_connected: false,
        system_integrations: {
          fa_integration: { name: 'Test', enabled: false },
          aws_environment: { name: 'Test', enabled: false },
          mbai_environment: { name: 'Test', enabled: false }
        }
      };

      try {
        const result = await containerService.createContainer(newContainerData);
        createdContainerId = result.id;

        expect(result).toHaveProperty('id');
        expect(result.name).toBe(newContainerData.name);
        expect(result.type).toBe(newContainerData.type);
        expect(result.tenant).toBe(newContainerData.tenant);
        expect(result.purpose).toBe(newContainerData.purpose);
        expect(result.status).toBe(newContainerData.status);
        expect(result.location).toEqual(newContainerData.location);
        expect(result.system_integrations).toEqual(newContainerData.system_integrations);
        expect(result).toHaveProperty('created');
        expect(result).toHaveProperty('modified');
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);

    it('should fetch container by ID', async () => {
      try {
        // First, get the default container or create one
        const containers = await containerService.getContainers(0, 1);
        let containerId: string;

        if (containers.data.length > 0) {
          containerId = containers.data[0].id;
        } else {
          // Create a test container if none exist
          const newContainer = await containerService.createContainer({
            name: 'test-fetch-container',
            type: 'PHYSICAL',
            tenant: 'test-tenant',
            purpose: 'Development',
            location: { city: 'Test', country: 'Test', address: 'Test' },
            status: 'ACTIVE',
            creator: 'Test',
            seed_types: ['test'],
            notes: 'Test',
            shadow_service_enabled: false,
            ecosystem_connected: false,
            system_integrations: {
              fa_integration: { name: 'Test', enabled: false },
              aws_environment: { name: 'Test', enabled: false },
              mbai_environment: { name: 'Test', enabled: false }
            }
          });
          containerId = newContainer.id;
          createdContainerId = containerId;
        }

        const result = await containerService.getContainerById(containerId);

        expect(result).toHaveProperty('id', containerId);
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('type');
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('location');
        expect(result.location).toHaveProperty('city');
        expect(result.location).toHaveProperty('country');
        expect(result.location).toHaveProperty('address');
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);

    it('should update a container', async () => {
      try {
        // Create a test container first
        const newContainer = await containerService.createContainer({
          name: 'test-update-container',
          type: 'PHYSICAL',
          tenant: 'test-tenant',
          purpose: 'Development',
          location: { city: 'Original City', country: 'Test', address: 'Test' },
          status: 'ACTIVE',
          creator: 'Test',
          seed_types: ['test'],
          notes: 'Original notes',
          shadow_service_enabled: false,
          ecosystem_connected: false,
          system_integrations: {
            fa_integration: { name: 'Test', enabled: false },
            aws_environment: { name: 'Test', enabled: false },
            mbai_environment: { name: 'Test', enabled: false }
          }
        });
        createdContainerId = newContainer.id;

        const updateData = {
          notes: 'Updated notes',
          location: { city: 'Updated City', country: 'Test', address: 'Test' }
        };

        const result = await containerService.updateContainer(newContainer.id, updateData);

        expect(result.id).toBe(newContainer.id);
        expect(result.notes).toBe('Updated notes');
        expect(result.location.city).toBe('Updated City');
        expect(new Date(result.modified).getTime()).toBeGreaterThan(new Date(newContainer.modified).getTime());
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);
  });

  describe('Container Metrics', () => {
    it('should fetch container metrics', async () => {
      try {
        // Get any available container
        const containers = await containerService.getContainers(0, 1);
        if (containers.data.length === 0) {
          console.warn('No containers available for metrics test');
          return;
        }

        const containerId = containers.data[0].id;
        const result = await containerService.getContainerMetrics(containerId, 'WEEK');

        // Validate metrics structure
        expect(result).toHaveProperty('temperature');
        expect(result).toHaveProperty('humidity');
        expect(result).toHaveProperty('co2');
        expect(result).toHaveProperty('yield');
        expect(result).toHaveProperty('nursery_utilization');
        expect(result).toHaveProperty('cultivation_utilization');

        // Validate metric value structure
        const validateMetricValue = (metric: any) => {
          expect(metric).toHaveProperty('current');
          expect(metric).toHaveProperty('unit');
          expect(typeof metric.current).toBe('number');
          expect(typeof metric.unit).toBe('string');
        };

        validateMetricValue(result.temperature);
        validateMetricValue(result.humidity);
        validateMetricValue(result.co2);
        validateMetricValue(result.yield);
        validateMetricValue(result.nursery_utilization);
        validateMetricValue(result.cultivation_utilization);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);

    it('should fetch metrics with different time ranges', async () => {
      try {
        const containers = await containerService.getContainers(0, 1);
        if (containers.data.length === 0) {
          console.warn('No containers available for metrics test');
          return;
        }

        const containerId = containers.data[0].id;
        const timeRanges = ['WEEK', 'MONTH', 'QUARTER', 'YEAR'] as const;

        for (const timeRange of timeRanges) {
          const result = await containerService.getContainerMetrics(containerId, timeRange);
          expect(result).toHaveProperty('temperature');
          expect(result.temperature).toHaveProperty('current');
        }
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);
  });

  describe('Container Crops', () => {
    it('should fetch container crops with pagination', async () => {
      try {
        const containers = await containerService.getContainers(0, 1);
        if (containers.data.length === 0) {
          console.warn('No containers available for crops test');
          return;
        }

        const containerId = containers.data[0].id;
        const result = await containerService.getContainerCrops(containerId, 0, 5);

        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('results');
        expect(typeof result.total).toBe('number');
        expect(Array.isArray(result.results)).toBe(true);

        // Validate crop structure if data exists
        if (result.results.length > 0) {
          const crop = result.results[0];
          expect(crop).toHaveProperty('id');
          expect(crop).toHaveProperty('seed_type');
          expect(crop).toHaveProperty('cultivation_area');
          expect(crop).toHaveProperty('nursery_table');
          expect(crop).toHaveProperty('avg_age');
          expect(crop).toHaveProperty('overdue');
          expect(typeof crop.cultivation_area).toBe('number');
          expect(typeof crop.nursery_table).toBe('number');
          expect(typeof crop.avg_age).toBe('number');
          expect(typeof crop.overdue).toBe('number');
        }
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);
  });

  describe('Container Activities', () => {
    it('should fetch container activities', async () => {
      try {
        const containers = await containerService.getContainers(0, 1);
        if (containers.data.length === 0) {
          console.warn('No containers available for activities test');
          return;
        }

        const containerId = containers.data[0].id;
        const result = await containerService.getContainerActivities(containerId, 5);

        expect(result).toHaveProperty('activities');
        expect(Array.isArray(result.activities)).toBe(true);

        // Validate activity structure if data exists
        if (result.activities.length > 0) {
          const activity = result.activities[0];
          expect(activity).toHaveProperty('id');
          expect(activity).toHaveProperty('type');
          expect(activity).toHaveProperty('timestamp');
          expect(activity).toHaveProperty('description');
          expect(activity).toHaveProperty('user');
          expect(activity).toHaveProperty('details');
          expect(['SEEDED', 'SYNCED', 'ENVIRONMENT_CHANGED', 'CREATED', 'MAINTENANCE']).toContain(activity.type);
          expect(activity.user).toHaveProperty('name');
          expect(activity.user).toHaveProperty('role');
        }
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);
  });

  describe('Error Handling', () => {
    it('should handle 404 errors correctly', async () => {
      try {
        await expect(containerService.getContainerById('non-existent-id')).rejects.toThrow('404');
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);

    it('should validate enum values', async () => {
      try {
        const invalidContainerData = {
          name: 'invalid-container',
          type: 'INVALID_TYPE', // Invalid enum value
          tenant: 'test-tenant',
          purpose: 'Development',
          location: { city: 'Test', country: 'Test', address: 'Test' },
          status: 'ACTIVE',
          creator: 'Test',
          seed_types: ['test'],
          notes: 'Test',
          shadow_service_enabled: false,
          ecosystem_connected: false,
          system_integrations: {
            fa_integration: { name: 'Test', enabled: false },
            aws_environment: { name: 'Test', enabled: false },
            mbai_environment: { name: 'Test', enabled: false }
          }
        };

        await expect(containerService.createContainer(invalidContainerData as any)).rejects.toThrow();
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);
  });

  describe('Data Model Validation', () => {
    it('should validate ContainerLocation structure', async () => {
      try {
        const containers = await containerService.getContainers(0, 1);
        if (containers.data.length === 0) {
          console.warn('No containers available for validation test');
          return;
        }

        const container = containers.data[0];
        expect(container.location).toHaveProperty('city');
        expect(container.location).toHaveProperty('country');
        expect(container.location).toHaveProperty('address');
        expect(typeof container.location.city).toBe('string');
        expect(typeof container.location.country).toBe('string');
        expect(typeof container.location.address).toBe('string');
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);

    it('should validate SystemIntegrations structure', async () => {
      try {
        const containers = await containerService.getContainers(0, 1);
        if (containers.data.length === 0) {
          console.warn('No containers available for validation test');
          return;
        }

        const container = containers.data[0];
        expect(container.system_integrations).toHaveProperty('fa_integration');
        expect(container.system_integrations).toHaveProperty('aws_environment');
        expect(container.system_integrations).toHaveProperty('mbai_environment');
        
        const validateIntegration = (integration: any) => {
          expect(integration).toHaveProperty('name');
          expect(integration).toHaveProperty('enabled');
          expect(typeof integration.name).toBe('string');
          expect(typeof integration.enabled).toBe('boolean');
        };

        validateIntegration(container.system_integrations.fa_integration);
        validateIntegration(container.system_integrations.aws_environment);
        validateIntegration(container.system_integrations.mbai_environment);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend not available, skipping test');
          return;
        }
        throw error;
      }
    }, TEST_CONFIG.INTEGRATION_TEST_TIMEOUT);
  });
});