import { containerApiService } from '../containerApiService';
import { authService } from '../authService';

describe('ContainerApiService Integration Tests', () => {
  // These tests run against the actual backend service
  // Make sure the backend is running before executing these tests

  const testCredentials = {
    username: process.env.VITE_DEFAULT_USERNAME || 'testuser',
    password: process.env.VITE_DEFAULT_PASSWORD || 'testpassword'
  };

  beforeAll(async () => {
    // Login before running integration tests
    try {
      await authService.login(testCredentials);
    } catch (error) {
      console.warn('Failed to login for integration tests:', error);
      // Skip tests if authentication fails
      return;
    }
  });

  afterAll(async () => {
    // Cleanup after tests
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Failed to logout after integration tests:', error);
    }
  });

  describe('Container CRUD Operations', () => {
    let createdContainerId: number;

    it('should create a new container', async () => {
      const containerData = {
        name: `Test Container ${Date.now()}`,
        tenant_id: 1,
        type: 'physical' as const,
        purpose: 'development' as const,
        location: {
          city: 'Test City',
          country: 'Test Country',
          address: '123 Test Street'
        },
        notes: 'Integration test container'
      };

      const result = await containerApiService.createContainer(containerData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(containerData.name);
      expect(result.type).toBe(containerData.type);
      expect(result.purpose).toBe(containerData.purpose);

      createdContainerId = result.id;
    });

    it('should get the created container', async () => {
      if (!createdContainerId) {
        throw new Error('No container created in previous test');
      }

      const result = await containerApiService.getContainer(createdContainerId);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdContainerId);
      expect(result.name).toContain('Test Container');
    });

    it('should update the container', async () => {
      if (!createdContainerId) {
        throw new Error('No container created in previous test');
      }

      const updateData = {
        name: `Updated Test Container ${Date.now()}`,
        status: 'maintenance' as const,
        notes: 'Updated during integration test'
      };

      const result = await containerApiService.updateContainer(createdContainerId, updateData);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdContainerId);
      expect(result.name).toBe(updateData.name);
      expect(result.status).toBe(updateData.status);
      expect(result.notes).toBe(updateData.notes);
    });

    it('should list containers including the created one', async () => {
      const result = await containerApiService.listContainers();

      expect(result).toBeDefined();
      expect(result.containers).toBeInstanceOf(Array);
      expect(result.pagination).toBeDefined();
      expect(result.performance_metrics).toBeDefined();

      if (createdContainerId) {
        const createdContainer = result.containers.find(c => c.id === createdContainerId);
        expect(createdContainer).toBeDefined();
      }
    });

    it('should search for containers', async () => {
      const result = await containerApiService.searchContainers('Test Container');

      expect(result).toBeDefined();
      expect(result.containers).toBeInstanceOf(Array);
      
      // Should find containers with "Test Container" in the name
      const foundContainers = result.containers.filter(c => 
        c.name.includes('Test Container')
      );
      expect(foundContainers.length).toBeGreaterThan(0);
    });

    it('should filter containers by type', async () => {
      const result = await containerApiService.getContainersByType('physical');

      expect(result).toBeDefined();
      expect(result.containers).toBeInstanceOf(Array);
      
      // All returned containers should be physical type
      result.containers.forEach(container => {
        expect(container.type).toBe('physical');
      });
    });

    it('should get containers by status', async () => {
      const result = await containerApiService.getContainersByStatus('active');

      expect(result).toBeDefined();
      expect(result.containers).toBeInstanceOf(Array);
      
      // All returned containers should be active
      result.containers.forEach(container => {
        expect(container.status).toBe('active');
      });
    });

    it('should get performance metrics', async () => {
      const result = await containerApiService.getPerformanceMetrics();

      expect(result).toBeDefined();
      expect(result.physical).toBeDefined();
      expect(result.virtual).toBeDefined();
      expect(result.time_range).toBeDefined();
      expect(result.generated_at).toBeDefined();
    });

    it('should get filter options', async () => {
      const result = await containerApiService.getFilterOptions();

      expect(result).toBeDefined();
      expect(result.tenants).toBeInstanceOf(Array);
      expect(result.purposes).toBeInstanceOf(Array);
      expect(result.statuses).toBeInstanceOf(Array);
      expect(result.container_types).toBeInstanceOf(Array);
    });

    it('should delete the created container', async () => {
      if (!createdContainerId) {
        throw new Error('No container created in previous test');
      }

      await expect(
        containerApiService.deleteContainer(createdContainerId)
      ).resolves.not.toThrow();

      // Verify deletion by trying to get the container (should fail)
      await expect(
        containerApiService.getContainer(createdContainerId)
      ).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent container', async () => {
      await expect(
        containerApiService.getContainer(99999)
      ).rejects.toThrow();
    });

    it('should handle validation errors on creation', async () => {
      const invalidData = {
        name: '', // Empty name should cause validation error
        tenant_id: 1,
        type: 'physical' as const,
        purpose: 'development' as const,
        location: {
          city: 'Test City',
          country: 'Test Country',
          address: '123 Test Street'
        }
      };

      await expect(
        containerApiService.createContainer(invalidData)
      ).rejects.toThrow();
    });
  });

  describe('Pagination and Filtering', () => {
    it('should handle pagination correctly', async () => {
      const page1 = await containerApiService.getPaginatedContainers(1, 5);
      
      expect(page1.containers.length).toBeLessThanOrEqual(5);
      expect(page1.pagination.page).toBe(1);
      expect(page1.pagination.limit).toBe(5);

      if (page1.pagination.total_pages > 1) {
        const page2 = await containerApiService.getPaginatedContainers(2, 5);
        
        expect(page2.containers.length).toBeLessThanOrEqual(5);
        expect(page2.pagination.page).toBe(2);
        expect(page2.pagination.limit).toBe(5);
        
        // Containers on different pages should be different
        const page1Ids = page1.containers.map(c => c.id);
        const page2Ids = page2.containers.map(c => c.id);
        expect(page1Ids).not.toEqual(page2Ids);
      }
    });

    it('should handle sorting correctly', async () => {
      const ascending = await containerApiService.getSortedContainers('name', 'asc');
      const descending = await containerApiService.getSortedContainers('name', 'desc');

      expect(ascending.containers).toBeInstanceOf(Array);
      expect(descending.containers).toBeInstanceOf(Array);

      if (ascending.containers.length > 1 && descending.containers.length > 1) {
        // First container in ascending should be different from first in descending
        expect(ascending.containers[0].id).not.toBe(descending.containers[0].id);
      }
    });
  });

  describe('Authentication Integration', () => {
    it('should handle authenticated requests correctly', async () => {
      // This test verifies that the service correctly includes auth headers
      const result = await containerApiService.listContainers();
      
      expect(result).toBeDefined();
      expect(result.containers).toBeInstanceOf(Array);
    });

    it('should handle unauthenticated requests', async () => {
      // Temporarily logout
      await authService.logout();

      // Request should fail without authentication
      await expect(
        containerApiService.listContainers()
      ).rejects.toThrow();

      // Login again for cleanup
      await authService.login(testCredentials);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large result sets efficiently', async () => {
      const startTime = performance.now();
      
      const result = await containerApiService.getPaginatedContainers(1, 100);
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result).toBeDefined();
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle concurrent requests', async () => {
      const promises = [
        containerApiService.listContainers(),
        containerApiService.getPerformanceMetrics(),
        containerApiService.getFilterOptions()
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toBeDefined();
      });
    });
  });
});