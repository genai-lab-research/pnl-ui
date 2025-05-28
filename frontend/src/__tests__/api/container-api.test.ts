/**
 * Container API Tests
 *
 * These tests verify that the container API endpoints work as expected.
 * They interact with the real API, so ensure the backend server is running.
 */
import { beforeAll, describe, expect, it } from 'vitest';

import containerService, { ContainerFormData } from '../../services/containerService';
import tenantService from '../../services/tenantService';
import { fail } from '../setup';

// Test configuration
const API_URL = 'http://localhost:8000/api/v1';
const TEST_TIMEOUT = 10000; // 10 seconds

// Sample container data for testing
const generateTestContainer = (): ContainerFormData => ({
  name: `test-container-${Date.now()}`, // Use timestamp for uniqueness
  tenant: '', // Will be filled in before test
  type: 'physical', // API expects lowercase here
  purpose: 'development', // API expects lowercase here
  seed_types: [],
  location: 'Test City, Test Country',
  notes: 'This is a test container created by automated tests',
  shadow_service_enabled: true,
  connect_to_other_systems: false,
});

// Tests for container-related API endpoints
describe('Container API', () => {
  // Setup before running tests
  beforeAll(async () => {
    console.log(`Running API tests against ${API_URL}`);
    console.log('Make sure the backend server is running!');
  });

  describe('Container creation', () => {
    // Create a container and verify it exists
    it(
      'should create a new container successfully',
      async () => {
        // First get a valid tenant to use
        const tenantResponse = await tenantService.getTenants();
        expect(tenantResponse.results.length).toBeGreaterThan(0);

        const tenant = tenantResponse.results[0];

        // Prepare container data
        const containerData = generateTestContainer();
        containerData.tenant = tenant.name;

        // Create the container
        const response = await containerService.createContainer(containerData);

        // Validate container creation response
        expect(response).toBeDefined();
        expect(response.id).toBeDefined();
        expect(response.name).toBe(containerData.name);
        expect(response.type).toBe('Physical'); // API returns 'Physical' not 'PHYSICAL'
        expect(response.shadow_service_enabled).toBe(containerData.shadow_service_enabled);

        // Get the container to verify it was created
        const containerList = await containerService.getContainers({
          name: containerData.name,
        });

        expect(containerList.total).toBeGreaterThan(0);
        expect(containerList.results.some((c) => c.name === containerData.name)).toBe(true);

        // Clean up - delete the test container
        if (response.id) {
          await containerService.deleteContainer(response.id);
        }
      },
      TEST_TIMEOUT,
    );

    it(
      'should validate container data client-side',
      async () => {
        // This test demonstrates client-side validation in our frontend
        // The CreateContainerModal would validate these fields before sending to API

        const isValidContainer = (container: ContainerFormData): boolean => {
          // Check for required fields
          if (!container.name || !container.tenant || !container.purpose) {
            return false;
          }

          // For physical containers, location is required
          if (container.type === 'physical' && !container.location) {
            return false;
          }

          return true;
        };

        // First get a valid tenant to use
        const tenantResponse = await tenantService.getTenants();
        expect(tenantResponse.results.length).toBeGreaterThan(0);
        const tenant = tenantResponse.results[0];

        // Prepare invalid container data (missing name field)
        const invalidContainer: ContainerFormData = {
          name: '',
          tenant: tenant.name,
          type: 'physical',
          purpose: 'development',
          seed_types: [],
          location: 'Test City, Test Country',
          notes: '',
          shadow_service_enabled: false,
          connect_to_other_systems: false,
        };

        // Test client-side validation
        expect(isValidContainer(invalidContainer)).toBe(false);

        // Fix the data
        const validContainer = {
          ...invalidContainer,
          name: `test-container-${Date.now()}`,
        };

        // Test that it's now valid
        expect(isValidContainer(validContainer)).toBe(true);
      },
      TEST_TIMEOUT,
    );

    it(
      'should return error when creating a container with duplicate name',
      async () => {
        // First get a valid tenant to use
        const tenantResponse = await tenantService.getTenants();
        const tenant = tenantResponse.results[0];

        // Prepare container data
        const containerData = generateTestContainer();
        containerData.tenant = tenant.name;

        // Create the first container
        const response = await containerService.createContainer(containerData);
        expect(response.id).toBeDefined();

        try {
          // Try to create a second container with the same name
          await containerService.createContainer(containerData);
          fail('Expected container creation with duplicate name to fail');
        } catch (error) {
          expect(error).toBeDefined();
        } finally {
          // Clean up - delete the test container
          if (response.id) {
            await containerService.deleteContainer(response.id);
          }
        }
      },
      TEST_TIMEOUT,
    );
  });

  describe('Container retrieval', () => {
    it(
      'should retrieve container list',
      async () => {
        const response = await containerService.getContainers();

        expect(response).toBeDefined();
        expect(response.total).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(response.results)).toBe(true);
      },
      TEST_TIMEOUT,
    );

    it(
      'should filter containers by type',
      async () => {
        const response = await containerService.getContainers({
          type: 'Physical' as any, // API expects 'Physical', not 'PHYSICAL'
        });

        expect(response).toBeDefined();
        expect(Array.isArray(response.results)).toBe(true);

        // Verify all returned containers have the correct type if any are returned
        if (response.results.length > 0) {
          response.results.forEach((container) => {
            expect(container.type).toBe('Physical'); // API returns 'Physical' not 'PHYSICAL'
          });
        }
      },
      TEST_TIMEOUT,
    );
  });

  describe('Container statistics', () => {
    it(
      'should retrieve container statistics',
      async () => {
        const stats = await containerService.getContainerStats();

        expect(stats).toBeDefined();
        expect(typeof stats.physical_count).toBe('number');
        expect(typeof stats.virtual_count).toBe('number');
      },
      TEST_TIMEOUT,
    );
  });
});
