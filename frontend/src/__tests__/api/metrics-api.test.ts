/**
 * Metrics API Tests
 * 
 * These tests verify that the metrics API endpoints work as expected.
 * They interact with the real API, so ensure the backend server is running.
 */

import { describe, it, expect } from 'vitest';
import metricsService, { MetricTimeRange } from '../../services/metricsService';
import containerService from '../../services/containerService';

// Test configuration
const API_URL = 'http://localhost:8000/api/v1';
const TEST_TIMEOUT = 10000; // 10 seconds

describe('Metrics API', () => {
  describe('Container metrics', () => {
    it('should retrieve metrics for a specific container', async () => {
      // First get a container to use
      const containerResponse = await containerService.getContainers({ limit: 1 });
      expect(containerResponse.results.length).toBeGreaterThan(0);
      
      const containerId = containerResponse.results[0].id;
      
      // Get metrics for this container
      const metrics = await metricsService.getContainerMetrics(containerId);
      
      expect(metrics).toBeDefined();
      expect(Array.isArray(metrics.yield_data)).toBe(true);
      expect(Array.isArray(metrics.space_utilization_data)).toBe(true);
      expect(typeof metrics.average_yield).toBe('number');
      expect(typeof metrics.total_yield).toBe('number');
      expect(typeof metrics.average_space_utilization).toBe('number');
      expect(typeof metrics.current_temperature).toBe('number');
      expect(typeof metrics.current_humidity).toBe('number');
      expect(typeof metrics.current_co2).toBe('number');
    }, TEST_TIMEOUT);

    it('should retrieve metrics with different time ranges', async () => {
      // First get a container to use
      const containerResponse = await containerService.getContainers({ limit: 1 });
      expect(containerResponse.results.length).toBeGreaterThan(0);
      
      const containerId = containerResponse.results[0].id;
      
      // Test with MONTH time range
      const monthMetrics = await metricsService.getContainerMetrics(containerId, 'MONTH');
      
      expect(monthMetrics).toBeDefined();
      expect(Array.isArray(monthMetrics.yield_data)).toBe(true);
      expect(Array.isArray(monthMetrics.space_utilization_data)).toBe(true);
      expect(typeof monthMetrics.average_yield).toBe('number');
      expect(typeof monthMetrics.total_yield).toBe('number');
      expect(typeof monthMetrics.average_space_utilization).toBe('number');
    }, TEST_TIMEOUT);
  });

  describe('Metric snapshots', () => {
    it('should retrieve metric snapshots for a container', async () => {
      // First get a container to use
      const containerResponse = await containerService.getContainers({ limit: 1 });
      expect(containerResponse.results.length).toBeGreaterThan(0);
      
      const containerId = containerResponse.results[0].id;
      
      // Get metric snapshots for this container
      const snapshots = await metricsService.getMetricSnapshots(containerId);
      
      expect(snapshots).toBeDefined();
      expect(Array.isArray(snapshots)).toBe(true);
      
      // Check structure of snapshots if any are returned
      if (snapshots.length > 0) {
        const snapshot = snapshots[0];
        expect(snapshot.container_id).toBe(containerId);
        expect(typeof snapshot.air_temperature).toBe('number');
        expect(typeof snapshot.humidity).toBe('number');
        expect(typeof snapshot.co2).toBe('number');
        expect(typeof snapshot.yield_kg).toBe('number');
        expect(typeof snapshot.space_utilization_percentage).toBe('number');
        expect(typeof snapshot.timestamp).toBe('string');
      }
    }, TEST_TIMEOUT);
  });
});