import { ContainerService } from '../containerService';
import { CreateContainerRequest } from '../../shared/types/containers';

describe('ContainerService Integration Tests', () => {
  let service: ContainerService;
  const baseUrl = 'http://localhost:8000/api';

  beforeAll(async () => {
    service = new ContainerService(baseUrl);
    
    // Wait for backend to be ready
    let retries = 5;
    while (retries > 0) {
      try {
        const response = await fetch(`${baseUrl}/containers`);
        if (response.ok || response.status === 200) break;
      } catch {
        // Backend not ready yet
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      retries--;
    }
    
    if (retries === 0) {
      console.warn('Backend service is not available for integration tests - skipping');
    }
  }, 30000);

  describe('Real API Endpoint Tests', () => {
    let createdContainerId: string;

    const testContainer: CreateContainerRequest = {
      name: 'Integration Test Container',
      tenant: 'test-tenant',
      type: 'virtual',
      purpose: 'development',
      location: 'Test City, Test Country',
      seed_types: ['test-seed'],
      notes: 'Created by integration test',
      shadow_service_enabled: false,
      connect_to_other_systems: true
    };

    it('should list all containers', async () => {
      const result = await service.listContainers();
      
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should create a new container', async () => {
      const result = await service.createContainer(testContainer);
      
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe(testContainer.name);
      expect(result.data?.type).toBe(testContainer.type);
      expect(result.data?.tenant).toBe(testContainer.tenant);
      expect(result.data?.purpose).toBe(testContainer.purpose);
      expect(result.data?.location).toBeDefined();
      expect(result.data?.id).toBeDefined();
      
      if (result.data?.id) {
        createdContainerId = result.data.id;
      }
    });

    it('should get a container by ID', async () => {
      if (!createdContainerId) {
        throw new Error('No container ID available for test');
      }

      const result = await service.getContainer(createdContainerId);
      
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe(createdContainerId);
      expect(result.data?.name).toBe(testContainer.name);
    });

    it('should update a container', async () => {
      if (!createdContainerId) {
        throw new Error('No container ID available for test');
      }

      const updates = {
        name: 'Updated Integration Test Container',
        status: 'maintenance' as const,
        notes: 'Updated by integration test'
      };

      const result = await service.updateContainer(createdContainerId, updates);
      
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe(updates.name);
      expect(result.data?.status).toBe(updates.status);
      expect(result.data?.notes).toBe(updates.notes);
    });

    it('should list containers with filters', async () => {
      const result = await service.listContainers({
        type: 'virtual',
        purpose: 'development',
        tenant: 'test-tenant'
      });
      
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      
      // Should contain our test container
      const containsTestContainer = result.data?.some(container => 
        container.id === createdContainerId
      );
      expect(containsTestContainer).toBe(true);
    });

    it('should search containers', async () => {
      const result = await service.listContainers({
        search: 'Integration Test'
      });
      
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      
      // Should contain our test container
      const containsTestContainer = result.data?.some(container => 
        container.name.includes('Integration Test')
      );
      expect(containsTestContainer).toBe(true);
    });

    it('should handle non-existent container', async () => {
      const result = await service.getContainer('non-existent-id');
      
      expect(result.error).toBeDefined();
      expect(result.error?.status_code).toBe(404);
      expect(result.data).toBeUndefined();
    });

    it('should delete a container', async () => {
      if (!createdContainerId) {
        throw new Error('No container ID available for test');
      }

      const result = await service.deleteContainer(createdContainerId);
      
      expect(result.error).toBeUndefined();
      expect(result.data).toBeUndefined(); // DELETE returns void
      
      // Verify container is deleted
      const getResult = await service.getContainer(createdContainerId);
      expect(getResult.error).toBeDefined();
      expect(getResult.error?.status_code).toBe(404);
    });

    it('should handle invalid create data', async () => {
      const invalidContainer = {
        // Missing required fields
        name: 'Invalid Container'
      } as CreateContainerRequest;

      const result = await service.createContainer(invalidContainer);
      
      expect(result.error).toBeDefined();
      expect(result.error?.status_code).toBe(422); // Validation error
    });
  });

  describe('CORS and Proxy Configuration Tests', () => {
    it('should work with relative URLs through proxy', async () => {
      // Test with relative URL (should go through Vite proxy)
      const proxyService = new ContainerService('/api');
      const result = await proxyService.listContainers();
      
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
    });

    it('should handle CORS properly', async () => {
      // This test verifies that CORS headers are properly configured
      const response = await fetch('/api/containers', {
        method: 'OPTIONS'
      });
      
      // Should not be blocked by CORS
      expect(response.status).not.toBe(0);
    });
  });
});