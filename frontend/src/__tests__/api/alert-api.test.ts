/**
 * Alert API Tests
 * 
 * These tests verify that the alert API endpoints work as expected.
 * They interact with the real API, so ensure the backend server is running.
 */

import { describe, it, expect } from 'vitest';
import { fail } from '../setup';
import alertService from '../../services/alertService';
import containerService from '../../services/containerService';

// Test configuration
const API_URL = 'http://localhost:8000/api/v1';
const TEST_TIMEOUT = 10000; // 10 seconds

describe('Alert API', () => {
  describe('Alert retrieval', () => {
    it('should retrieve all alerts', async () => {
      const response = await alertService.getAlerts();
      
      expect(response).toBeDefined();
      expect(typeof response.total).toBe('number');
      expect(Array.isArray(response.results)).toBe(true);
    }, TEST_TIMEOUT);

    it('should filter alerts by active status', async () => {
      const response = await alertService.getAlerts({ active: true });
      
      expect(response).toBeDefined();
      expect(Array.isArray(response.results)).toBe(true);
      
      // Verify all returned alerts have active=true if any are returned
      if (response.results.length > 0) {
        response.results.forEach(alert => {
          expect(alert.active).toBe(true);
        });
      }
    }, TEST_TIMEOUT);
  });

  describe('Container alerts', () => {
    it('should retrieve alerts for a specific container', async () => {
      // First get a container to use
      const containerResponse = await containerService.getContainers({ limit: 1 });
      expect(containerResponse.results.length).toBeGreaterThan(0);
      
      const containerId = containerResponse.results[0].id;
      
      // Get alerts for this container
      const alertResponse = await alertService.getContainerAlerts(containerId);
      
      expect(alertResponse).toBeDefined();
      expect(typeof alertResponse.total).toBe('number');
      expect(Array.isArray(alertResponse.results)).toBe(true);
      
      // Verify all returned alerts belong to the specified container if any are returned
      if (alertResponse.results.length > 0) {
        alertResponse.results.forEach(alert => {
          expect(alert.container_id).toBe(containerId);
        });
      }
    }, TEST_TIMEOUT);
  });

  describe('Alert details', () => {
    it('should retrieve a specific alert by ID if it exists', async () => {
      // First get any alert to test with
      const alertsResponse = await alertService.getAlerts({ limit: 1 });
      
      if (alertsResponse.results.length === 0) {
        console.log('No alerts available to test getAlertById');
        return;
      }
      
      const alertId = alertsResponse.results[0].id;
      const alert = await alertService.getAlertById(alertId);
      
      expect(alert).toBeDefined();
      expect(alert.id).toBe(alertId);
      expect(typeof alert.description).toBe('string');
      expect(typeof alert.created_at).toBe('string');
      // Backend might return capitalized or Title Case severities
      const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'Low', 'Medium', 'High', 'Critical'];
      expect(validSeverities).toContain(alert.severity);
    }, TEST_TIMEOUT);
  });
});