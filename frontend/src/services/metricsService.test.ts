import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import metricsService from './metricsService';
import { MetricTimeRange } from '../shared/types/metrics';
import { server } from '../test/mocks/server';

// Mock the config
vi.mock('./config', () => ({
  default: {
    api: {
      baseUrl: 'http://localhost:8000/api/v1',
      enableMockFallback: false,
      isDevelopment: true,
      timeout: 10000,
    },
    endpoints: {
      metricsContainer: (id: string) => `/metrics/container/${id}`,
      performance: '/performance',
    }
  }
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Metrics Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Disable MSW for unit tests that mock fetch directly
    server.close();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Re-enable MSW for other tests
    server.listen();
  });

  describe('getContainerMetrics', () => {
    it('should fetch container metrics with default parameters', async () => {
      const containerId = 'container-123';
      const mockMetrics = {
        yield_data: [
          { date: '2024-01-01', value: 25 },
          { date: '2024-01-02', value: 30 },
          { date: '2024-01-03', value: 22 }
        ],
        space_utilization_data: [
          { date: '2024-01-01', value: 75 },
          { date: '2024-01-02', value: 80 },
          { date: '2024-01-03', value: 72 }
        ],
        average_yield: 25.7,
        total_yield: 77,
        average_space_utilization: 75.7,
        current_temperature: 22.5,
        current_humidity: 65,
        current_co2: 850,
        crop_counts: {
          seeded: 150,
          transplanted: 120,
          harvested: 80
        },
        is_daily: true
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics,
      });

      const result = await metricsService.getContainerMetrics(containerId);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/metrics/container/container-123?time_range=WEEK',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        })
      );

      expect(result).toEqual(mockMetrics);
      expect(result.yield_data).toHaveLength(3);
      expect(result.space_utilization_data).toHaveLength(3);
      expect(result.average_yield).toBe(25.7);
      expect(result.crop_counts.seeded).toBe(150);
    });

    it('should fetch container metrics with custom time range', async () => {
      const containerId = 'container-123';
      const timeRange: MetricTimeRange = 'MONTH';
      
      const mockMetrics = {
        yield_data: [],
        space_utilization_data: [],
        average_yield: 0,
        total_yield: 0,
        average_space_utilization: 0,
        current_temperature: 0,
        current_humidity: 0,
        current_co2: 0,
        crop_counts: { seeded: 0, transplanted: 0, harvested: 0 },
        is_daily: false
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics,
      });

      await metricsService.getContainerMetrics(containerId, timeRange);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/metrics/container/container-123?time_range=MONTH',
        expect.any(Object)
      );
    });

    it('should fetch container metrics with custom time range and start date', async () => {
      const containerId = 'container-123';
      const timeRange: MetricTimeRange = 'QUARTER';
      const startDate = '2024-01-01';
      
      const mockMetrics = {
        yield_data: [],
        space_utilization_data: [],
        average_yield: 0,
        total_yield: 0,
        average_space_utilization: 0,
        current_temperature: 0,
        current_humidity: 0,
        current_co2: 0,
        crop_counts: { seeded: 0, transplanted: 0, harvested: 0 },
        is_daily: false
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics,
      });

      await metricsService.getContainerMetrics(containerId, timeRange, startDate);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/metrics/container/container-123?time_range=QUARTER&start_date=2024-01-01',
        expect.any(Object)
      );
    });

    it('should handle API errors', async () => {
      const containerId = 'invalid-container';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Container not found',
      });

      await expect(metricsService.getContainerMetrics(containerId)).rejects.toThrow(
        'API request failed: 404 Not Found. Container not found'
      );
    });

    it('should handle missing container metrics', async () => {
      const containerId = 'container-no-metrics';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'No metrics found for container',
      });

      await expect(metricsService.getContainerMetrics(containerId)).rejects.toThrow(
        'API request failed: 404 Not Found. No metrics found for container'
      );
    });
  });

  describe('getPerformanceOverview', () => {
    it('should fetch performance overview without time range', async () => {
      const mockPerformance = {
        physical: {
          count: 12,
          yield: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [25, 20, 24, 18, 23, 19, 22],
            avgYield: 63,
            totalYield: 81
          },
          spaceUtilization: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [80, 75, 83, 76, 82, 70, 75],
            avgUtilization: 80
          }
        },
        virtual: {
          count: 8,
          yield: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [22, 19, 23, 18, 21, 17, 20],
            avgYield: 63,
            totalYield: 81
          },
          spaceUtilization: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [65, 60, 68, 62, 66, 59, 64],
            avgUtilization: 80
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPerformance,
      });

      const result = await metricsService.getPerformanceOverview();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/performance',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        })
      );

      expect(result).toEqual(mockPerformance);
      expect(result.physical.count).toBe(12);
      expect(result.virtual.count).toBe(8);
      expect(result.physical.yield.labels).toHaveLength(7);
      expect(result.virtual.yield.data).toHaveLength(7);
    });

    it('should fetch performance overview with time range', async () => {
      const timeRange: MetricTimeRange = 'MONTH';
      
      const mockPerformance = {
        physical: {
          count: 12,
          yield: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [100, 120, 110, 130],
            avgYield: 115,
            totalYield: 460
          },
          spaceUtilization: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [85, 88, 82, 90],
            avgUtilization: 86.25
          }
        },
        virtual: {
          count: 8,
          yield: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [80, 95, 85, 100],
            avgYield: 90,
            totalYield: 360
          },
          spaceUtilization: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [70, 75, 68, 78],
            avgUtilization: 72.75
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPerformance,
      });

      const result = await metricsService.getPerformanceOverview(timeRange);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/performance?time_range=MONTH',
        expect.any(Object)
      );

      expect(result).toEqual(mockPerformance);
      expect(result.physical.yield.labels).toHaveLength(4);
      expect(result.virtual.yield.labels).toHaveLength(4);
    });

    it('should handle performance API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Database connection failed',
      });

      await expect(metricsService.getPerformanceOverview()).rejects.toThrow(
        'API request failed: 500 Internal Server Error. Database connection failed'
      );
    });

    it('should handle empty performance data', async () => {
      const mockEmptyPerformance = {
        physical: {
          count: 0,
          yield: {
            labels: [],
            data: [],
            avgYield: 0,
            totalYield: 0
          },
          spaceUtilization: {
            labels: [],
            data: [],
            avgUtilization: 0
          }
        },
        virtual: {
          count: 0,
          yield: {
            labels: [],
            data: [],
            avgYield: 0,
            totalYield: 0
          },
          spaceUtilization: {
            labels: [],
            data: [],
            avgUtilization: 0
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEmptyPerformance,
      });

      const result = await metricsService.getPerformanceOverview();

      expect(result).toEqual(mockEmptyPerformance);
      expect(result.physical.count).toBe(0);
      expect(result.virtual.count).toBe(0);
    });
  });

  describe('Network error handling', () => {
    it('should handle network errors for getContainerMetrics', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

      await expect(metricsService.getContainerMetrics('container-123')).rejects.toThrow(
        'Network error: Unable to connect to the API server. Please check if the backend is running.'
      );
    });

    it('should handle network errors for getPerformanceOverview', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

      await expect(metricsService.getPerformanceOverview()).rejects.toThrow(
        'Network error: Unable to connect to the API server. Please check if the backend is running.'
      );
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));

      await expect(metricsService.getContainerMetrics('container-123')).rejects.toThrow(
        'Aborted'
      );
    });
  });

  describe('Parameter encoding', () => {
    it('should properly encode time range parameters', async () => {
      const containerId = 'container-123';
      const timeRange: MetricTimeRange = 'QUARTER';
      const startDate = '2024-01-01T00:00:00Z';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          yield_data: [],
          space_utilization_data: [],
          average_yield: 0,
          total_yield: 0,
          average_space_utilization: 0,
          current_temperature: 0,
          current_humidity: 0,
          current_co2: 0,
          crop_counts: { seeded: 0, transplanted: 0, harvested: 0 },
          is_daily: false
        }),
      });

      await metricsService.getContainerMetrics(containerId, timeRange, startDate);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/metrics/container/container-123?time_range=QUARTER&start_date=2024-01-01T00%3A00%3A00Z',
        expect.any(Object)
      );
    });

    it('should skip undefined parameters', async () => {
      const containerId = 'container-123';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          yield_data: [],
          space_utilization_data: [],
          average_yield: 0,
          total_yield: 0,
          average_space_utilization: 0,
          current_temperature: 0,
          current_humidity: 0,
          current_co2: 0,
          crop_counts: { seeded: 0, transplanted: 0, harvested: 0 },
          is_daily: false
        }),
      });

      await metricsService.getContainerMetrics(containerId, 'WEEK', undefined);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/metrics/container/container-123?time_range=WEEK',
        expect.any(Object)
      );
    });
  });

  describe('Response validation', () => {
    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
      });

      await expect(metricsService.getContainerMetrics('container-123')).rejects.toThrow(
        'Unexpected token'
      );
    });

    it('should validate metric response structure', async () => {
      const containerId = 'container-123';
      const incompleteMetrics = {
        yield_data: [{ date: '2024-01-01', value: 25 }],
        // Missing required fields
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => incompleteMetrics,
      });

      const result = await metricsService.getContainerMetrics(containerId);

      // Service should return whatever the API returns, even if incomplete
      expect(result).toEqual(incompleteMetrics);
      expect(result.yield_data).toBeDefined();
    });
  });
});