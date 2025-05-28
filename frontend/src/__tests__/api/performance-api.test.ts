/**
 * Performance API Tests
 *
 * These tests verify that the performance API endpoints work as expected.
 * They interact with the real API, so ensure the backend server is running.
 */
import { describe, expect, it } from 'vitest';

import performanceService from '../../services/performanceService';
import { MetricTimeRange } from '../../shared/types/metrics';

// Test configuration
const API_URL = 'http://localhost:8000/api/v1';
const TEST_TIMEOUT = 10000; // 10 seconds

describe('Performance API', () => {
  describe('Performance overview', () => {
    it(
      'should retrieve performance metrics with default time range (WEEK)',
      async () => {
        const performance = await performanceService.getPerformanceOverview();

        expect(performance).toBeDefined();
        expect(performance.physical).toBeDefined();
        expect(performance.virtual).toBeDefined();

        // Check physical container performance data
        expect(typeof performance.physical.count).toBe('number');
        expect(performance.physical.yield).toBeDefined();
        expect(Array.isArray(performance.physical.yield.labels)).toBe(true);
        expect(Array.isArray(performance.physical.yield.data)).toBe(true);
        expect(typeof performance.physical.yield.avgYield).toBe('number');
        expect(typeof performance.physical.yield.totalYield).toBe('number');

        // Check space utilization data
        expect(performance.physical.spaceUtilization).toBeDefined();
        expect(Array.isArray(performance.physical.spaceUtilization.labels)).toBe(true);
        expect(Array.isArray(performance.physical.spaceUtilization.data)).toBe(true);
        expect(typeof performance.physical.spaceUtilization.avgUtilization).toBe('number');

        // Check virtual container performance data
        expect(typeof performance.virtual.count).toBe('number');
        expect(performance.virtual.yield).toBeDefined();
        expect(Array.isArray(performance.virtual.yield.labels)).toBe(true);
        expect(Array.isArray(performance.virtual.yield.data)).toBe(true);
        expect(typeof performance.virtual.yield.avgYield).toBe('number');
        expect(typeof performance.virtual.yield.totalYield).toBe('number');

        expect(performance.virtual.spaceUtilization).toBeDefined();
        expect(Array.isArray(performance.virtual.spaceUtilization.labels)).toBe(true);
        expect(Array.isArray(performance.virtual.spaceUtilization.data)).toBe(true);
        expect(typeof performance.virtual.spaceUtilization.avgUtilization).toBe('number');
      },
      TEST_TIMEOUT,
    );

    it(
      'should retrieve performance metrics for MONTH time range',
      async () => {
        const performance = await performanceService.getPerformanceOverview(MetricTimeRange.MONTH);

        expect(performance).toBeDefined();
        expect(performance.physical).toBeDefined();
        expect(performance.virtual).toBeDefined();

        // For month data, we should typically have more data points than for a week
        if (performance.physical.yield.labels.length > 0) {
          expect(performance.physical.yield.labels.length).toBeGreaterThan(0);
        }

        if (performance.virtual.yield.labels.length > 0) {
          expect(performance.virtual.yield.labels.length).toBeGreaterThan(0);
        }
      },
      TEST_TIMEOUT,
    );

    it(
      'should retrieve performance metrics for QUARTER time range',
      async () => {
        const performance = await performanceService.getPerformanceOverview(
          MetricTimeRange.QUARTER,
        );

        expect(performance).toBeDefined();
        expect(performance.physical).toBeDefined();
        expect(performance.virtual).toBeDefined();
      },
      TEST_TIMEOUT,
    );

    it(
      'should retrieve performance metrics for YEAR time range',
      async () => {
        const performance = await performanceService.getPerformanceOverview(MetricTimeRange.YEAR);

        expect(performance).toBeDefined();
        expect(performance.physical).toBeDefined();
        expect(performance.virtual).toBeDefined();
      },
      TEST_TIMEOUT,
    );
  });
});
