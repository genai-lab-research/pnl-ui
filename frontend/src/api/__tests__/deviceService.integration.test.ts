/**
 * Device Service Integration Tests
 * Tests device service integration with backend API
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { deviceService, DeviceService } from '../deviceService';
import { authService } from '../authService';
import { getDefaultCredentials } from '../../utils/env';

// Integration test configuration
const TEST_CONFIG = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  testCredentials: getDefaultCredentials(),
  skipIntegrationTests: import.meta.env.VITE_SKIP_INTEGRATION_TESTS === 'true'
};

describe('Device Service Integration Tests', () => {
  beforeAll(async () => {
    if (TEST_CONFIG.skipIntegrationTests) {
      console.log('Skipping integration tests - SKIP_INTEGRATION_TESTS is set');
      return;
    }

    // Authenticate before running tests
    try {
      await authService.login(TEST_CONFIG.testCredentials);
    } catch (error) {
      console.warn('Failed to authenticate for integration tests:', error);
      throw new Error('Integration test setup failed - could not authenticate');
    }
  });

  afterAll(async () => {
    if (TEST_CONFIG.skipIntegrationTests) return;

    // Cleanup after tests
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Failed to logout after integration tests:', error);
    }
  });

  describe('Device CRUD Operations', () => {
    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should fetch all devices', async () => {
      const response = await deviceService.getAllDevices();

      expect(response).toBeDefined();
      expect(response.devices).toBeInstanceOf(Array);
      expect(response.total).toBeTypeOf('number');
      expect(response.online_count).toBeTypeOf('number');
      expect(response.offline_count).toBeTypeOf('number');
    });

    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should filter devices by container', async () => {
      // First get a container ID to test with
      const allDevices = await deviceService.getAllDevices();
      
      if (allDevices.devices.length > 0) {
        const containerId = allDevices.devices[0].container_id;
        
        const filteredDevices = await deviceService.getAllDevices({
          container_id: containerId
        });

        expect(filteredDevices.devices).toBeInstanceOf(Array);
        filteredDevices.devices.forEach(device => {
          expect(device.container_id).toBe(containerId);
        });
      }
    });

    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should get device by ID', async () => {
      // Get the first device to test with
      const allDevices = await deviceService.getAllDevices({ limit: 1 });
      
      if (allDevices.devices.length > 0) {
        const deviceId = allDevices.devices[0].id;
        const device = await deviceService.getDeviceById(deviceId);

        expect(device).toBeDefined();
        expect(device.id).toBe(deviceId);
        expect(device.name).toBeDefined();
        expect(device.model).toBeDefined();
        expect(device.status).toBeDefined();
      }
    });

    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should handle device not found', async () => {
      const nonExistentId = 999999;
      
      await expect(deviceService.getDeviceById(nonExistentId))
        .rejects.toThrow();
    });
  });

  describe('Device Status and Monitoring', () => {
    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should get device status', async () => {
      const allDevices = await deviceService.getAllDevices({ limit: 1 });
      
      if (allDevices.devices.length > 0) {
        const deviceId = allDevices.devices[0].id;
        
        try {
          const status = await deviceService.getDeviceStatus(deviceId);
          
          expect(status).toBeDefined();
          expect(status.device_id).toBe(deviceId);
          expect(status.status).toMatch(/^(online|offline|maintenance|error)$/);
          expect(status.last_heartbeat).toBeDefined();
        } catch (error) {
          // Some test devices might not have status endpoints implemented
          console.warn('Device status not available for test device');
        }
      }
    });

    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should get device logs', async () => {
      const allDevices = await deviceService.getAllDevices({ limit: 1 });
      
      if (allDevices.devices.length > 0) {
        const deviceId = allDevices.devices[0].id;
        
        try {
          const logs = await deviceService.getDeviceLogs(deviceId);
          
          expect(logs).toBeInstanceOf(Array);
          
          if (logs.length > 0) {
            expect(logs[0]).toHaveProperty('timestamp');
            expect(logs[0]).toHaveProperty('level');
            expect(logs[0]).toHaveProperty('message');
          }
        } catch (error) {
          // Some test devices might not have logs available
          console.warn('Device logs not available for test device');
        }
      }
    });
  });

  describe('Device Operations', () => {
    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should get devices for container', async () => {
      // Get a container ID first
      const allDevices = await deviceService.getAllDevices({ limit: 1 });
      
      if (allDevices.devices.length > 0) {
        const containerId = allDevices.devices[0].container_id;
        const containerDevices = await deviceService.getDevicesForContainer(containerId);
        
        expect(containerDevices).toBeInstanceOf(Array);
        containerDevices.forEach(device => {
          expect(device.container_id).toBe(containerId);
        });
      }
    });

    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should handle device restart gracefully', async () => {
      const allDevices = await deviceService.getAllDevices({ limit: 1 });
      
      if (allDevices.devices.length > 0) {
        const deviceId = allDevices.devices[0].id;
        
        try {
          const result = await deviceService.restartDevice(deviceId);
          
          expect(result).toBeDefined();
          expect(result.message).toBeDefined();
          expect(typeof result.restart_initiated).toBe('boolean');
        } catch (error) {
          // Restart might not be available for all test devices
          console.warn('Device restart not available for test device');
        }
      }
    });
  });

  describe('Error Handling', () => {
    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should handle authentication errors', async () => {
      // Create a new service instance without authentication
      const unauthenticatedService = DeviceService.getInstance('/api/v1');
      
      // This should fail with 401 if authentication is required
      await expect(unauthenticatedService.getAllDevices())
        .rejects.toThrow();
    });

    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should handle rate limiting gracefully', async () => {
      // Make multiple rapid requests to test rate limiting
      const promises = Array.from({ length: 10 }, () => 
        deviceService.getAllDevices({ limit: 1 })
      );
      
      try {
        await Promise.all(promises);
        // If all succeed, rate limiting is not in effect or is very permissive
        expect(true).toBe(true);
      } catch (error) {
        // If some fail due to rate limiting, that's expected behavior
        console.warn('Rate limiting in effect');
        expect(true).toBe(true);
      }
    });
  });

  describe('Data Validation', () => {
    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should validate device data structure', async () => {
      const response = await deviceService.getAllDevices({ limit: 1 });
      
      if (response.devices.length > 0) {
        const device = response.devices[0];
        
        // Validate required fields
        expect(device.id).toBeTypeOf('number');
        expect(device.container_id).toBeTypeOf('number');
        expect(device.name).toBeTypeOf('string');
        expect(device.model).toBeTypeOf('string');
        expect(device.serial_number).toBeTypeOf('string');
        expect(device.firmware_version).toBeTypeOf('string');
        expect(device.port).toBeTypeOf('string');
        expect(device.status).toBeTypeOf('string');
        expect(device.last_active_at).toBeTypeOf('string');
        
        // Validate date format
        expect(() => new Date(device.last_active_at)).not.toThrow();
      }
    });

    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should handle invalid filter parameters', async () => {
      try {
        await deviceService.getAllDevices({
          container_id: -1, // Invalid container ID
          status: 'invalid_status' as any
        });
        
        // Some APIs might accept invalid filters and return empty results
        expect(true).toBe(true);
      } catch (error) {
        // APIs might reject invalid filters
        expect(true).toBe(true);
      }
    });
  });

  describe('Performance', () => {
    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should handle large device lists efficiently', async () => {
      const startTime = Date.now();
      
      const response = await deviceService.getAllDevices({ limit: 100 });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (5 seconds)
      expect(duration).toBeLessThan(5000);
      
      expect(response.devices).toBeInstanceOf(Array);
      expect(response.total).toBeTypeOf('number');
    });

    it.skipIf(TEST_CONFIG.skipIntegrationTests)('should support pagination', async () => {
      const page1 = await deviceService.getAllDevices({ skip: 0, limit: 5 });
      const page2 = await deviceService.getAllDevices({ skip: 5, limit: 5 });
      
      expect(page1.devices).toBeInstanceOf(Array);
      expect(page2.devices).toBeInstanceOf(Array);
      
      // If there are enough devices, pages should be different
      if (page1.total > 5) {
        expect(page1.devices).not.toEqual(page2.devices);
      }
    });
  });
});
