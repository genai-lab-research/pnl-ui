import { metricsService } from '../metricsService';
import { MetricSnapshot, ActivityLog, MetricSnapshotListFilters, ActivityLogListFilters } from '../../types/verticalFarm';

// Mock the base service
jest.mock('../baseService');

describe('MetricsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMetricSnapshot: MetricSnapshot = {
    id: 1,
    container_id: 1,
    timestamp: '2023-01-01T00:00:00Z',
    air_temperature: 22.5,
    humidity: 65.0,
    co2: 400,
    yield_kg: 5.2,
    space_utilization_pct: 85.0
  };

  const mockActivityLog: ActivityLog = {
    id: 1,
    container_id: 1,
    timestamp: '2023-01-01T00:00:00Z',
    action_type: 'sensor_reading',
    actor_type: 'system',
    actor_id: 'sensor_123',
    description: 'Temperature sensor reading recorded'
  };

  describe('Metric Snapshots', () => {
    describe('getMetricSnapshots', () => {
      test('should return list of metric snapshots', async () => {
        const mockGet = jest.spyOn(metricsService as any, 'get');
        mockGet.mockResolvedValue([mockMetricSnapshot]);

        const result = await metricsService.getMetricSnapshots();

        expect(mockGet).toHaveBeenCalledWith('/metrics/snapshots/');
        expect(result).toEqual([mockMetricSnapshot]);
      });

      test('should handle filters', async () => {
        const mockGet = jest.spyOn(metricsService as any, 'get');
        const mockBuildQueryString = jest.spyOn(metricsService as any, 'buildQueryString');
        mockBuildQueryString.mockReturnValue('?container_id=1&start_date=2023-01-01');
        mockGet.mockResolvedValue([mockMetricSnapshot]);

        const filters: MetricSnapshotListFilters = { container_id: 1, start_date: '2023-01-01' };
        const result = await metricsService.getMetricSnapshots(filters);

        expect(mockBuildQueryString).toHaveBeenCalledWith(filters);
        expect(mockGet).toHaveBeenCalledWith('/metrics/snapshots/?container_id=1&start_date=2023-01-01');
        expect(result).toEqual([mockMetricSnapshot]);
      });
    });

    describe('getMetricSnapshotById', () => {
      test('should return specific metric snapshot', async () => {
        const mockGet = jest.spyOn(metricsService as any, 'get');
        mockGet.mockResolvedValue(mockMetricSnapshot);

        const result = await metricsService.getMetricSnapshotById(1);

        expect(mockGet).toHaveBeenCalledWith('/metrics/snapshots/1');
        expect(result).toEqual(mockMetricSnapshot);
      });
    });

    describe('getMetricSnapshotsByContainer', () => {
      test('should return metrics for specific container', async () => {
        const mockGetMetricSnapshots = jest.spyOn(metricsService, 'getMetricSnapshots');
        mockGetMetricSnapshots.mockResolvedValue([mockMetricSnapshot]);

        const result = await metricsService.getMetricSnapshotsByContainer(1);

        expect(mockGetMetricSnapshots).toHaveBeenCalledWith({ container_id: 1 });
        expect(result).toEqual([mockMetricSnapshot]);
      });
    });

    describe('getMetricSnapshotsByDateRange', () => {
      test('should return metrics for date range', async () => {
        const mockGetMetricSnapshots = jest.spyOn(metricsService, 'getMetricSnapshots');
        mockGetMetricSnapshots.mockResolvedValue([mockMetricSnapshot]);

        const result = await metricsService.getMetricSnapshotsByDateRange('2023-01-01', '2023-01-31');

        expect(mockGetMetricSnapshots).toHaveBeenCalledWith({ 
          start_date: '2023-01-01', 
          end_date: '2023-01-31' 
        });
        expect(result).toEqual([mockMetricSnapshot]);
      });
    });

    describe('getMetricSnapshotsByContainerAndDateRange', () => {
      test('should return metrics for container and date range', async () => {
        const mockGetMetricSnapshots = jest.spyOn(metricsService, 'getMetricSnapshots');
        mockGetMetricSnapshots.mockResolvedValue([mockMetricSnapshot]);

        const result = await metricsService.getMetricSnapshotsByContainerAndDateRange(
          1, '2023-01-01', '2023-01-31'
        );

        expect(mockGetMetricSnapshots).toHaveBeenCalledWith({ 
          container_id: 1,
          start_date: '2023-01-01', 
          end_date: '2023-01-31' 
        });
        expect(result).toEqual([mockMetricSnapshot]);
      });
    });
  });

  describe('Activity Logs', () => {
    describe('getActivityLogs', () => {
      test('should return list of activity logs', async () => {
        const mockGet = jest.spyOn(metricsService as any, 'get');
        mockGet.mockResolvedValue([mockActivityLog]);

        const result = await metricsService.getActivityLogs();

        expect(mockGet).toHaveBeenCalledWith('/activity-logs/');
        expect(result).toEqual([mockActivityLog]);
      });

      test('should handle filters', async () => {
        const mockGet = jest.spyOn(metricsService as any, 'get');
        const mockBuildQueryString = jest.spyOn(metricsService as any, 'buildQueryString');
        mockBuildQueryString.mockReturnValue('?container_id=1&action_type=sensor_reading');
        mockGet.mockResolvedValue([mockActivityLog]);

        const filters: ActivityLogListFilters = { container_id: 1, action_type: 'sensor_reading' };
        const result = await metricsService.getActivityLogs(filters);

        expect(mockBuildQueryString).toHaveBeenCalledWith(filters);
        expect(mockGet).toHaveBeenCalledWith('/activity-logs/?container_id=1&action_type=sensor_reading');
        expect(result).toEqual([mockActivityLog]);
      });
    });

    describe('getActivityLogById', () => {
      test('should return specific activity log', async () => {
        const mockGet = jest.spyOn(metricsService as any, 'get');
        mockGet.mockResolvedValue(mockActivityLog);

        const result = await metricsService.getActivityLogById(1);

        expect(mockGet).toHaveBeenCalledWith('/activity-logs/1');
        expect(result).toEqual(mockActivityLog);
      });
    });

    describe('getActivityLogsByContainer', () => {
      test('should return activity logs for specific container', async () => {
        const mockGetActivityLogs = jest.spyOn(metricsService, 'getActivityLogs');
        mockGetActivityLogs.mockResolvedValue([mockActivityLog]);

        const result = await metricsService.getActivityLogsByContainer(1);

        expect(mockGetActivityLogs).toHaveBeenCalledWith({ container_id: 1 });
        expect(result).toEqual([mockActivityLog]);
      });
    });

    describe('getActivityLogsByActionType', () => {
      test('should return activity logs by action type', async () => {
        const mockGetActivityLogs = jest.spyOn(metricsService, 'getActivityLogs');
        mockGetActivityLogs.mockResolvedValue([mockActivityLog]);

        const result = await metricsService.getActivityLogsByActionType('sensor_reading');

        expect(mockGetActivityLogs).toHaveBeenCalledWith({ action_type: 'sensor_reading' });
        expect(result).toEqual([mockActivityLog]);
      });
    });

    describe('getActivityLogsByActorType', () => {
      test('should return activity logs by actor type', async () => {
        const mockGetActivityLogs = jest.spyOn(metricsService, 'getActivityLogs');
        mockGetActivityLogs.mockResolvedValue([mockActivityLog]);

        const result = await metricsService.getActivityLogsByActorType('system');

        expect(mockGetActivityLogs).toHaveBeenCalledWith({ actor_type: 'system' });
        expect(result).toEqual([mockActivityLog]);
      });
    });

    describe('getRecentActivityLogsByContainer', () => {
      test('should return recent activity logs for container', async () => {
        const mockGetActivityLogs = jest.spyOn(metricsService, 'getActivityLogs');
        mockGetActivityLogs.mockResolvedValue([mockActivityLog]);

        const result = await metricsService.getRecentActivityLogsByContainer(1, 5);

        expect(mockGetActivityLogs).toHaveBeenCalledWith({ container_id: 1 });
        expect(result).toEqual([mockActivityLog]);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors for metric snapshots', async () => {
      const mockGet = jest.spyOn(metricsService as any, 'get');
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(metricsService.getMetricSnapshots()).rejects.toThrow('Network error');
    });

    test('should handle network errors for activity logs', async () => {
      const mockGet = jest.spyOn(metricsService as any, 'get');
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(metricsService.getActivityLogs()).rejects.toThrow('Network error');
    });

    test('should handle API errors', async () => {
      const mockGet = jest.spyOn(metricsService as any, 'get');
      const error = { message: 'Invalid date range', status: 400 };
      mockGet.mockRejectedValue(error);

      await expect(metricsService.getMetricSnapshots()).rejects.toEqual(error);
    });
  });
});