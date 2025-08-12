// Integration tests for Container Overview feature
// Tests real API integration and error handling scenarios

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { containerOverviewApiAdapter } from '../services/container-overview-api.adapter';
import { metricsApiAdapter } from '../services/metrics-api.adapter';
import { activityLogApiAdapter } from '../services/activity-log-api.adapter';
import { settingsApiAdapter } from '../services/settings-api.adapter';

// Mock the container service
vi.mock('../../../api/containerService', () => ({
  containerService: {
    makeAuthenticatedRequest: vi.fn(),
    getContainer: vi.fn()
  }
}));

describe('Container Overview API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('containerOverviewApiAdapter', () => {
    it('should fetch container info successfully', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      const mockContainer = {
        id: 123,
        name: 'Test Container',
        type: 'physical',
        tenant_id: 1,
        location: {
          city: 'San Francisco',
          country: 'USA',
          address: '123 Main St'
        },
        status: 'active'
      };

      vi.mocked(containerService.getContainer).mockResolvedValue(mockContainer as any);

      const result = await containerOverviewApiAdapter.getContainerInfo(123);

      expect(result).toEqual({
        id: 123,
        name: 'Test Container',
        type: 'physical',
        tenant: {
          id: 1,
          name: 'Tenant 1' // This is mocked in the adapter
        },
        location: {
          city: 'San Francisco',
          country: 'USA',
          address: '123 Main St'
        },
        status: 'active'
      });
    });

    it('should handle API errors gracefully', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      vi.mocked(containerService.getContainer).mockRejectedValue(new Error('Network error'));

      await expect(containerOverviewApiAdapter.getContainerInfo(123))
        .rejects.toThrow('Failed to load container overview data');
    });

    it('should fetch container overview with query parameters', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      const mockOverview = {
        container: { id: 123, name: 'Test Container' },
        dashboard_metrics: {
          air_temperature: 23.5,
          humidity: 65,
          co2: 400,
          yield: { average: 5.2, total: 5.2, chart_data: [] },
          space_utilization: { nursery_station: 45, cultivation_area: 30, chart_data: [] }
        },
        crops_summary: [],
        recent_activity: []
      };

      // Mock the internal makeAuthenticatedRequest method
      vi.mocked(containerService['makeAuthenticatedRequest']).mockResolvedValue(mockOverview);

      const result = await containerOverviewApiAdapter.getContainerOverview(123, 'month', 'hour');

      expect(containerService['makeAuthenticatedRequest']).toHaveBeenCalledWith(
        '/containers/123/overview?time_range=month&metric_interval=hour'
      );
      expect(result.container.id).toBe(123);
    });
  });

  describe('metricsApiAdapter', () => {
    it('should fetch metric snapshots with parameters', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      const mockSnapshots = [
        {
          id: 1,
          container_id: 123,
          timestamp: '2024-01-01T00:00:00Z',
          air_temperature: 23.5,
          humidity: 65,
          co2: 400,
          yield_kg: 5.2,
          space_utilization_pct: 75
        }
      ];

      vi.mocked(containerService['makeAuthenticatedRequest']).mockResolvedValue(mockSnapshots);

      const result = await metricsApiAdapter.getMetricSnapshots(123, {
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        interval: 'day'
      });

      expect(containerService['makeAuthenticatedRequest']).toHaveBeenCalledWith(
        '/containers/123/metric-snapshots?start_date=2024-01-01&end_date=2024-01-31&interval=day'
      );
      expect(result).toEqual(mockSnapshots);
    });

    it('should create metric snapshots', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      const newMetrics = {
        air_temperature: 24.0,
        humidity: 70,
        co2: 450,
        yield_kg: 6.0,
        space_utilization_pct: 80
      };

      const mockResponse = {
        id: 2,
        container_id: 123,
        timestamp: '2024-01-02T00:00:00Z',
        ...newMetrics
      };

      vi.mocked(containerService['makeAuthenticatedRequest']).mockResolvedValue(mockResponse);

      const result = await metricsApiAdapter.createMetricSnapshot(123, newMetrics);

      expect(containerService['makeAuthenticatedRequest']).toHaveBeenCalledWith(
        '/containers/123/metric-snapshots',
        {
          method: 'POST',
          body: JSON.stringify(newMetrics)
        }
      );
      expect(result.id).toBe(2);
    });

    it('should transform snapshots to dashboard metrics', () => {
      const snapshots = [
        {
          id: 1,
          container_id: 123,
          timestamp: '2024-01-01T00:00:00Z',
          air_temperature: 23.5,
          humidity: 65,
          co2: 400,
          yield_kg: 5.2,
          space_utilization_pct: 75
        },
        {
          id: 2,
          container_id: 123,
          timestamp: '2024-01-02T00:00:00Z',
          air_temperature: 24.0,
          humidity: 70,
          co2: 450,
          yield_kg: 6.0,
          space_utilization_pct: 80
        }
      ];

      const result = metricsApiAdapter.transformToDashboardMetrics(snapshots);

      expect(result.air_temperature.value).toBe(24.0);
      expect(result.air_temperature.unit).toBe('°C');
      expect(result.yield.average).toBe(5.6); // (5.2 + 6.0) / 2
      expect(result.yield.total).toBe(11.2); // 5.2 + 6.0
      expect(result.yield.chart_data).toHaveLength(2);
    });
  });

  describe('activityLogApiAdapter', () => {
    it('should fetch activity logs with pagination', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      const mockResponse = {
        activities: [
          {
            id: 1,
            container_id: 123,
            timestamp: '2024-01-01T10:00:00Z',
            action_type: 'seeding',
            actor_type: 'user',
            actor_id: 'user123',
            description: 'Seeded tomato plants'
          }
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          total_pages: 1
        }
      };

      vi.mocked(containerService['makeAuthenticatedRequest']).mockResolvedValue(mockResponse);

      const result = await activityLogApiAdapter.getActivityLogs(123, {
        page: 1,
        limit: 20,
        action_type: 'seeding'
      });

      expect(containerService['makeAuthenticatedRequest']).toHaveBeenCalledWith(
        '/containers/123/activity-logs?page=1&limit=20&action_type=seeding'
      );
      expect(result.activities).toHaveLength(1);
      expect(result.activities[0].timestamp).toBe('2024-01-01T10:00:00.000Z');
    });

    it('should create activity log entries', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      const newActivity = {
        action_type: 'harvesting',
        actor_type: 'robot',
        actor_id: 'robot001',
        description: 'Harvested lettuce crop'
      };

      const mockResponse = {
        id: 2,
        container_id: 123,
        timestamp: '2024-01-02T15:00:00Z',
        ...newActivity
      };

      vi.mocked(containerService['makeAuthenticatedRequest']).mockResolvedValue(mockResponse);

      const result = await activityLogApiAdapter.createActivityLog(123, newActivity);

      expect(containerService['makeAuthenticatedRequest']).toHaveBeenCalledWith(
        '/containers/123/activity-logs',
        {
          method: 'POST',
          body: JSON.stringify(newActivity)
        }
      );
      expect(result.id).toBe(2);
    });

    it('should search activities', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      const mockActivities = [
        {
          id: 1,
          container_id: 123,
          timestamp: '2024-01-01T10:00:00Z',
          action_type: 'seeding',
          actor_type: 'user',
          actor_id: 'user123',
          description: 'Seeded tomato plants in nursery area'
        }
      ];

      const mockResponse = {
        activities: mockActivities,
        pagination: { page: 1, limit: 500, total: 1, total_pages: 1 }
      };

      vi.mocked(containerService['makeAuthenticatedRequest']).mockResolvedValue(mockResponse);

      const result = await activityLogApiAdapter.searchActivities(123, 'tomato');

      expect(result).toHaveLength(1);
      expect(result[0].description).toContain('tomato');
    });
  });

  describe('settingsApiAdapter', () => {
    it('should fetch container settings', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      const mockContainer = {
        id: 123,
        tenant_id: 1,
        purpose: 'production',
        location: {
          city: 'San Francisco',
          country: 'USA',
          address: '123 Main St'
        },
        notes: 'Test container',
        shadow_service_enabled: true,
        copied_environment_from: null,
        robotics_simulation_enabled: false,
        ecosystem_connected: true,
        ecosystem_settings: {}
      };

      vi.mocked(containerService.getContainer).mockResolvedValue(mockContainer as any);

      const result = await settingsApiAdapter.getContainerSettings(123);

      expect(result.tenant_id).toBe(1);
      expect(result.purpose).toBe('production');
      expect(result.location?.city).toBe('San Francisco');
    });

    it('should update container settings', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      const updates = {
        purpose: 'development' as const,
        notes: 'Updated test container'
      };

      const mockResponse = {
        success: true,
        message: 'Settings updated successfully',
        updated_at: '2024-01-01T12:00:00Z'
      };

      vi.mocked(containerService['makeAuthenticatedRequest']).mockResolvedValue(mockResponse);

      const result = await settingsApiAdapter.updateContainerSettings(123, updates);

      expect(containerService['makeAuthenticatedRequest']).toHaveBeenCalledWith(
        '/containers/123/settings',
        {
          method: 'PUT',
          body: JSON.stringify(updates)
        }
      );
      expect(result.success).toBe(true);
    });

    it('should fetch and update environment links', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      const mockLinks = {
        container_id: 123,
        fa: { url: 'http://fa.example.com', token: 'fa-token' },
        pya: { url: 'http://pya.example.com', token: 'pya-token' },
        aws: {},
        mbai: {},
        fh: {}
      };

      vi.mocked(containerService['makeAuthenticatedRequest']).mockResolvedValue(mockLinks);

      const result = await settingsApiAdapter.getEnvironmentLinks(123);

      expect(containerService['makeAuthenticatedRequest']).toHaveBeenCalledWith(
        '/containers/123/environment-links'
      );
      expect(result.container_id).toBe(123);
      expect(result.fa).toEqual({ url: 'http://fa.example.com', token: 'fa-token' });
    });

    it('should test environment connections', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      const mockTestResult = {
        connected: true,
        last_checked: '2024-01-01T12:00:00Z'
      };

      vi.mocked(containerService['makeAuthenticatedRequest']).mockResolvedValue(mockTestResult);

      const result = await settingsApiAdapter.testEnvironmentConnection(123, 'fa');

      expect(containerService['makeAuthenticatedRequest']).toHaveBeenCalledWith(
        '/containers/123/environment-links/fa/test',
        { method: 'POST' }
      );
      expect(result.connected).toBe(true);
    });

    it('should handle connection test failures gracefully', async () => {
      const { containerService } = await import('../../../api/containerService');
      
      vi.mocked(containerService['makeAuthenticatedRequest']).mockRejectedValue(new Error('Connection failed'));

      const result = await settingsApiAdapter.testEnvironmentConnection(123, 'fa');

      expect(result.connected).toBe(false);
      expect(result.error).toBe('Connection failed');
    });
  });
});

// Error handling and edge cases
describe('Error Handling and Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle 401 authentication errors', async () => {
    const { containerService } = await import('../../../api/containerService');
    
    const authError = new Error('HTTP 401: Unauthorized');
    vi.mocked(containerService.getContainer).mockRejectedValue(authError);

    await expect(containerOverviewApiAdapter.getContainerInfo(123))
      .rejects.toThrow('Failed to load container overview data');
  });

  it('should handle 404 not found errors', async () => {
    const { containerService } = await import('../../../api/containerService');
    
    const notFoundError = new Error('HTTP 404: Not Found');
    vi.mocked(containerService['makeAuthenticatedRequest']).mockRejectedValue(notFoundError);

    await expect(metricsApiAdapter.getMetricSnapshots(999))
      .rejects.toThrow('Failed to load container metrics');
  });

  it('should handle empty data gracefully', () => {
    expect(() => metricsApiAdapter.transformToDashboardMetrics([]))
      .toThrow('No metric data available');
  });

  it('should validate settings updates', async () => {
    const validationResult = await settingsApiAdapter.validateSettings(123, {
      tenant_id: -1, // Invalid
      purpose: 'invalid' as any // Invalid
    });

    expect(validationResult.valid).toBe(false);
    expect(validationResult.errors).toHaveLength(2);
    expect(validationResult.errors[0].field).toBe('tenant_id');
    expect(validationResult.errors[1].field).toBe('purpose');
  });

  it('should handle network timeouts', async () => {
    const { containerService } = await import('../../../api/containerService');
    
    const timeoutError = new Error('Network timeout');
    vi.mocked(containerService['makeAuthenticatedRequest']).mockRejectedValue(timeoutError);

    await expect(activityLogApiAdapter.getActivityLogs(123))
      .rejects.toThrow('Failed to load activity logs');
  });
});
