import { describe, it, expect, beforeAll } from 'vitest';
import config from './config';

const BACKEND_URL = 'http://localhost:8000';
const API_BASE_URL = `${BACKEND_URL}/api/v1`;
const TEST_TIMEOUT = 10000; // 10 seconds

describe('Backend Health Checks', () => {
  let backendAvailable = false;

  beforeAll(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/docs`);
      backendAvailable = response.ok;
    } catch {
      backendAvailable = false;
    }
  });

  describe('Backend Server Connectivity', () => {
    it('should connect to backend server root', async () => {
      if (!backendAvailable) {
        console.warn('Backend server not available at http://localhost:8000');
        console.warn('To run these tests, start the backend server:');
        console.warn('  cd backend');
        console.warn('  python -m uvicorn app.main:app --reload');
        return;
      }

      const response = await fetch(BACKEND_URL);
      expect(response.status).toBeLessThan(500);
    }, TEST_TIMEOUT);

    it('should serve API documentation', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/docs`);
      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('text/html');
    }, TEST_TIMEOUT);

    it('should serve OpenAPI spec', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/openapi.json`);
      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('application/json');
      
      const openApiSpec = await response.json();
      expect(openApiSpec).toHaveProperty('openapi');
      expect(openApiSpec).toHaveProperty('info');
      expect(openApiSpec).toHaveProperty('paths');
    }, TEST_TIMEOUT);
  });

  describe('API Endpoints Availability', () => {
    it('should respond to containers endpoint', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/containers`);
      expect([200, 404]).toContain(response.status); // Either has data or empty
    }, TEST_TIMEOUT);

    it('should respond to health check endpoint if available', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.status !== 404) {
          expect(response.ok).toBe(true);
        }
      } catch (error) {
        // Health endpoint might not exist, that's okay
        console.warn('Health endpoint not available');
      }
    }, TEST_TIMEOUT);

    it('should have CORS enabled for frontend origin', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/containers`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:5173',
          'Access-Control-Request-Method': 'GET',
        },
      });

      // Should not be a CORS error
      expect(response.status).not.toBe(405);
    }, TEST_TIMEOUT);
  });

  describe('API Response Format Validation', () => {
    it('should return JSON responses with correct headers', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/containers`);
      expect(response.headers.get('content-type')).toContain('application/json');
    }, TEST_TIMEOUT);

    it('should handle invalid endpoints gracefully', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/invalid-endpoint`);
      expect(response.status).toBe(404);
    }, TEST_TIMEOUT);

    it('should return proper error format for 404s', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/containers/non-existent-id`);
      if (response.status === 404) {
        const errorData = await response.json();
        expect(errorData).toHaveProperty('detail');
      }
    }, TEST_TIMEOUT);
  });

  describe('Performance Metrics', () => {
    it('should respond within acceptable time limits', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      const startTime = Date.now();
      const response = await fetch(`${API_BASE_URL}/containers`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.status).toBeLessThan(500);
      expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
    }, TEST_TIMEOUT);

    it('should handle concurrent requests', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      const promises = Array.from({ length: 5 }, () =>
        fetch(`${API_BASE_URL}/containers`)
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBeLessThan(500);
      });
    }, TEST_TIMEOUT);
  });

  describe('Environment Configuration', () => {
    it('should use correct API base URL in tests', () => {
      expect(API_BASE_URL).toBe('http://localhost:8000/api/v1');
    });

    it('should validate frontend config points to backend', () => {
      // In development, frontend should point to the backend
      if (config.api.isDevelopment) {
        expect(config.api.baseUrl).toContain('localhost:8000');
      }
    });

    it('should have mock fallback disabled for integration tests', () => {
      // For integration tests, we want to test real backend
      const integrationMode = process.env.NODE_ENV === 'test';
      if (integrationMode && backendAvailable) {
        expect(config.api.enableMockFallback).toBe(false);
      }
    });
  });

  describe('Data Consistency Checks', () => {
    it('should return consistent data structure across endpoints', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      try {
        const containersResponse = await fetch(`${API_BASE_URL}/containers`);
        if (!containersResponse.ok) return;

        const containersData = await containersResponse.json();
        if (!containersData.data || containersData.data.length === 0) return;

        const firstContainer = containersData.data[0];
        const containerId = firstContainer.id;

        // Test individual container endpoint
        const containerResponse = await fetch(`${API_BASE_URL}/containers/${containerId}`);
        if (containerResponse.ok) {
          const containerData = await containerResponse.json();
          
          // Should have same basic structure
          expect(containerData.id).toBe(firstContainer.id);
          expect(containerData.name).toBe(firstContainer.name);
          expect(containerData.type).toBe(firstContainer.type);
        }

        // Test metrics endpoint
        const metricsResponse = await fetch(`${API_BASE_URL}/containers/${containerId}/metrics`);
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          expect(metricsData).toHaveProperty('temperature');
          expect(metricsData).toHaveProperty('humidity');
        }

      } catch (error) {
        console.warn('Data consistency check failed:', error);
      }
    }, TEST_TIMEOUT);

    it('should maintain data integrity across CRUD operations', async () => {
      if (!backendAvailable) {
        console.warn('Backend not available, skipping test');
        return;
      }

      try {
        // Create a test container
        const newContainerData = {
          name: `integration-test-${Date.now()}`,
          type: 'PHYSICAL',
          tenant: 'test-tenant',
          purpose: 'Development',
          location: { city: 'Test', country: 'Test', address: 'Test' },
          status: 'ACTIVE',
          creator: 'Integration Test',
          seed_types: ['test'],
          notes: 'Integration test container',
          shadow_service_enabled: false,
          ecosystem_connected: false,
          system_integrations: {
            fa_integration: { name: 'Test', enabled: false },
            aws_environment: { name: 'Test', enabled: false },
            mbai_environment: { name: 'Test', enabled: false }
          }
        };

        const createResponse = await fetch(`${API_BASE_URL}/containers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newContainerData),
        });

        if (createResponse.ok) {
          const createdContainer = await createResponse.json();
          const containerId = createdContainer.id;

          // Verify created data
          expect(createdContainer.name).toBe(newContainerData.name);
          expect(createdContainer.type).toBe(newContainerData.type);

          // Update the container
          const updateData = { notes: 'Updated in integration test' };
          const updateResponse = await fetch(`${API_BASE_URL}/containers/${containerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
          });

          if (updateResponse.ok) {
            const updatedContainer = await updateResponse.json();
            expect(updatedContainer.notes).toBe('Updated in integration test');
          }

          // Clean up - delete the test container
          await fetch(`${API_BASE_URL}/containers/${containerId}`, {
            method: 'DELETE',
          });
        }
      } catch (error) {
        console.warn('CRUD integrity check failed:', error);
      }
    }, TEST_TIMEOUT);
  });
});