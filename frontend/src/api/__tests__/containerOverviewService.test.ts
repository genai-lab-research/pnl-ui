import { containerOverviewService } from '../containerOverviewService';
import { TokenStorage } from '../../utils/tokenStorage';
import {
  ContainerOverview,
  ActivityLogResponse,
  MetricSnapshot,
  ContainerSettingsUpdateResponse,
  EnvironmentLinks,
  DashboardSummary
} from '../../types/containerOverview';

// Mock TokenStorage
jest.mock('../../utils/tokenStorage');
const mockTokenStorage = TokenStorage as jest.Mocked<typeof TokenStorage>;

// Mock window.location
const mockLocation = {
  href: ''
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ContainerOverviewService', () => {
  const mockToken = 'mock-jwt-token';
  const containerId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTokenStorage.getAccessToken.mockReturnValue(mockToken);
  });

  describe('getContainerOverview', () => {
    it('should fetch container overview successfully', async () => {
      const mockOverview: ContainerOverview = {
        container: {
          id: 1,
          name: 'Test Container',
          type: 'Production',
          tenant: { id: 1, name: 'Test Tenant' },
          location: { city: 'Test City' },
          status: 'Active'
        },
        dashboard_metrics: {
          air_temperature: 22.5,
          humidity: 65.0,
          co2: 400,
          yield: {
            average: 15.2,
            total: 152.0,
            chart_data: [{
              date: '2023-01-01',
              value: 15.2,
              is_current_period: true,
              is_future: false
            }]
          },
          space_utilization: {
            nursery_station: 80.5,
            cultivation_area: 75.0,
            chart_data: [{
              date: '2023-01-01',
              nursery_value: 80.5,
              cultivation_value: 75.0,
              is_current_period: true,
              is_future: false
            }]
          }
        },
        crops_summary: [{
          seed_type: 'Lettuce',
          nursery_station_count: 50,
          cultivation_area_count: 30,
          average_age: 14,
          overdue_count: 2
        }],
        recent_activity: [{
          id: 1,
          container_id: 1,
          timestamp: '2023-01-01T10:00:00Z',
          action_type: 'Seeding',
          actor_type: 'User',
          actor_id: 'user123',
          description: 'Seeded lettuce trays'
        }]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOverview
      } as Response);

      const result = await containerOverviewService.getContainerOverview(containerId);

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1/overview', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`
        }
      });
      expect(result).toEqual(mockOverview);
    });

    it('should handle query parameters', async () => {
      const mockOverview: ContainerOverview = {
        container: {
          id: 1,
          name: 'Test Container',
          type: 'Production',
          tenant: { id: 1, name: 'Test Tenant' },
          location: {},
          status: 'Active'
        },
        dashboard_metrics: {
          air_temperature: 22.5,
          humidity: 65.0,
          co2: 400,
          yield: { average: 15.2, total: 152.0, chart_data: [] },
          space_utilization: { nursery_station: 80.5, cultivation_area: 75.0, chart_data: [] }
        },
        crops_summary: [],
        recent_activity: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOverview
      } as Response);

      await containerOverviewService.getContainerOverview(containerId, {
        time_range: 'week',
        metric_interval: 'day'
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1/overview?time_range=week&metric_interval=day', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`
        }
      });
    });

    it('should handle 401 error by clearing token and redirecting', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401
      } as Response);

      await expect(containerOverviewService.getContainerOverview(containerId)).rejects.toThrow('Authentication required');

      expect(mockTokenStorage.clearToken).toHaveBeenCalled();
      expect(mockLocation.href).toBe('/login');
    });
  });

  describe('getActivityLogs', () => {
    it('should fetch activity logs successfully', async () => {
      const mockResponse: ActivityLogResponse = {
        activities: [{
          id: 1,
          container_id: 1,
          timestamp: '2023-01-01T10:00:00Z',
          action_type: 'Seeding',
          actor_type: 'User',
          actor_id: 'user123',
          description: 'Seeded lettuce trays'
        }],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          total_pages: 1
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await containerOverviewService.getActivityLogs(containerId, {
        page: 1,
        limit: 20
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1/activity-logs?page=1&limit=20', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`
        }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createActivityLog', () => {
    it('should create activity log successfully', async () => {
      const mockActivityLog = {
        id: 1,
        container_id: 1,
        timestamp: '2023-01-01T10:00:00Z',
        action_type: 'Seeding',
        actor_type: 'User',
        actor_id: 'user123',
        description: 'Seeded lettuce trays'
      };

      const activityData = {
        action_type: 'Seeding',
        actor_type: 'User',
        actor_id: 'user123',
        description: 'Seeded lettuce trays'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockActivityLog
      } as Response);

      const result = await containerOverviewService.createActivityLog(containerId, activityData);

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1/activity-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`
        },
        body: JSON.stringify(activityData)
      });
      expect(result).toEqual(mockActivityLog);
    });
  });

  describe('getMetricSnapshots', () => {
    it('should fetch metric snapshots successfully', async () => {
      const mockSnapshots: MetricSnapshot[] = [{
        id: 1,
        container_id: 1,
        timestamp: '2023-01-01T10:00:00Z',
        air_temperature: 22.5,
        humidity: 65.0,
        co2: 400,
        yield_kg: 15.2,
        space_utilization_pct: 80.5
      }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSnapshots
      } as Response);

      const result = await containerOverviewService.getMetricSnapshots(containerId, {
        start_date: '2023-01-01',
        end_date: '2023-01-31',
        interval: 'day'
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1/metric-snapshots?start_date=2023-01-01&end_date=2023-01-31&interval=day', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`
        }
      });
      expect(result).toEqual(mockSnapshots);
    });
  });

  describe('createMetricSnapshot', () => {
    it('should create metric snapshot successfully', async () => {
      const mockSnapshot: MetricSnapshot = {
        id: 1,
        container_id: 1,
        timestamp: '2023-01-01T10:00:00Z',
        air_temperature: 22.5,
        humidity: 65.0,
        co2: 400,
        yield_kg: 15.2,
        space_utilization_pct: 80.5
      };

      const snapshotData = {
        air_temperature: 22.5,
        humidity: 65.0,
        co2: 400,
        yield_kg: 15.2,
        space_utilization_pct: 80.5
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSnapshot
      } as Response);

      const result = await containerOverviewService.createMetricSnapshot(containerId, snapshotData);

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1/metric-snapshots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`
        },
        body: JSON.stringify(snapshotData)
      });
      expect(result).toEqual(mockSnapshot);
    });
  });

  describe('updateContainerSettings', () => {
    it('should update container settings successfully', async () => {
      const mockResponse: ContainerSettingsUpdateResponse = {
        success: true,
        message: 'Settings updated successfully',
        updated_at: '2023-01-01T10:00:00Z'
      };

      const settingsData = {
        tenant_id: 1,
        purpose: 'Production',
        location: { city: 'Test City' },
        notes: 'Updated settings',
        shadow_service_enabled: true,
        robotics_simulation_enabled: false,
        ecosystem_connected: true,
        ecosystem_settings: {}
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await containerOverviewService.updateContainerSettings(containerId, settingsData);

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`
        },
        body: JSON.stringify(settingsData)
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getEnvironmentLinks', () => {
    it('should fetch environment links successfully', async () => {
      const mockLinks: EnvironmentLinks = {
        container_id: 1,
        fa: { endpoint: 'fa.example.com' },
        pya: { endpoint: 'pya.example.com' },
        aws: { endpoint: 'aws.example.com' },
        mbai: { endpoint: 'mbai.example.com' },
        fh: { endpoint: 'fh.example.com' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLinks
      } as Response);

      const result = await containerOverviewService.getEnvironmentLinks(containerId);

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1/environment-links', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`
        }
      });
      expect(result).toEqual(mockLinks);
    });
  });

  describe('getDashboardSummary', () => {
    it('should fetch dashboard summary successfully', async () => {
      const mockSummary: DashboardSummary = {
        current_metrics: {
          air_temperature: 22.5,
          humidity: 65.0,
          co2: 400,
          yield_kg: 15.2,
          space_utilization_pct: 80.5
        },
        crop_counts: {
          total_crops: 100,
          nursery_crops: 50,
          cultivation_crops: 45,
          overdue_crops: 5
        },
        activity_count: 25,
        last_updated: '2023-01-01T10:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummary
      } as Response);

      const result = await containerOverviewService.getDashboardSummary(containerId);

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1/dashboard-summary', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`
        }
      });
      expect(result).toEqual(mockSummary);
    });
  });

  describe('utility methods', () => {
    it('should get recent activity', async () => {
      const mockResponse: ActivityLogResponse = {
        activities: [{
          id: 1,
          container_id: 1,
          timestamp: '2023-01-01T10:00:00Z',
          action_type: 'Seeding',
          actor_type: 'User',
          actor_id: 'user123',
          description: 'Seeded lettuce trays'
        }],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          total_pages: 1
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await containerOverviewService.getRecentActivity(containerId, 10);

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/containers/1/activity-logs?limit=10&page=1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`
        }
      });
      expect(result).toEqual(mockResponse.activities);
    });

    it('should get latest metrics', async () => {
      const mockSnapshots: MetricSnapshot[] = [{
        id: 1,
        container_id: 1,
        timestamp: '2023-01-01T10:00:00Z',
        air_temperature: 22.5,
        humidity: 65.0,
        co2: 400,
        yield_kg: 15.2,
        space_utilization_pct: 80.5
      }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSnapshots
      } as Response);

      const result = await containerOverviewService.getLatestMetrics(containerId);

      expect(result).toEqual(mockSnapshots[0]);
    });

    it('should return null when no metrics available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response);

      const result = await containerOverviewService.getLatestMetrics(containerId);

      expect(result).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(containerOverviewService.getContainerOverview(containerId)).rejects.toThrow('Network error');
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ detail: 'Bad request' })
      } as Response);

      await expect(containerOverviewService.getContainerOverview(containerId)).rejects.toThrow('Bad request');
    });

    it('should handle empty error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => { throw new Error('Invalid JSON'); }
      } as unknown as Response);

      await expect(containerOverviewService.getContainerOverview(containerId)).rejects.toThrow('HTTP 500');
    });
  });
});