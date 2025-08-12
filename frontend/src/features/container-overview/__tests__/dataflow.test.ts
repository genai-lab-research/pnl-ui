// Dataflow tests for Container Overview feature
// Tests the flow of data through models, viewmodels, and hooks

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Import the modules to test
import { ContainerOverviewModel } from '../models/container-overview.model';
import { DashboardMetricsModel } from '../models/dashboard-metrics.model';
import { CropSummaryModel } from '../models/crop-summary.model';
import { ActivityLogModel } from '../models/activity-log.model';
import { ContainerSettingsModel } from '../models/settings.model';

import { ContainerOverviewViewModel } from '../viewmodels/container-overview.viewmodel';
import { DashboardMetricsViewModel } from '../viewmodels/dashboard-metrics.viewmodel';

import { useContainerOverview } from '../hooks/useContainerOverview';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';

// Mock API adapters
vi.mock('../services/container-overview-api.adapter', () => ({
  containerOverviewApiAdapter: {
    getContainerInfo: vi.fn(),
    getContainerOverview: vi.fn(),
    checkContainerPermissions: vi.fn()
  }
}));

vi.mock('../services/metrics-api.adapter', () => ({
  metricsApiAdapter: {
    getAggregatedMetrics: vi.fn(),
    transformToDashboardMetrics: vi.fn(),
    startMetricsPolling: vi.fn(() => () => {})
  }
}));

describe('Container Overview Dataflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ContainerOverviewModel', () => {
    it('should initialize with correct default state', () => {
      const model = new ContainerOverviewModel(123);
      
      expect(model.containerId).toBe(123);
      expect(model.containerInfo).toBeNull();
      expect(model.activeTab).toBe('overview');
      expect(model.isLoading).toBe(false);
      expect(model.error).toBeNull();
    });

    it('should update container info correctly', () => {
      const model = new ContainerOverviewModel(123);
      const containerInfo = {
        id: 123,
        name: 'Test Container',
        type: 'physical' as const,
        tenant: { id: 1, name: 'Test Tenant' },
        status: 'active' as const
      };

      model.setContainerInfo(containerInfo);
      
      expect(model.containerInfo).toEqual(containerInfo);
    });

    it('should generate correct breadcrumbs', () => {
      const model = new ContainerOverviewModel(123);
      model.setContainerInfo({
        id: 123,
        name: 'Test Container',
        type: 'physical',
        tenant: { id: 1, name: 'Test Tenant' },
        status: 'active'
      });

      const breadcrumbs = model.getBreadcrumbs();
      
      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0]).toEqual({
        label: 'Container Management Dashboard',
        path: '/dashboard',
        isActive: false
      });
      expect(breadcrumbs[1]).toEqual({
        label: 'Test Container',
        isActive: true
      });
    });

    it('should generate correct tabs with container ID', () => {
      const model = new ContainerOverviewModel(123);
      const tabs = model.getTabs();
      
      expect(tabs).toHaveLength(4);
      expect(tabs[0]).toEqual({
        key: 'overview',
        label: 'Overview',
        path: '/containers/123/overview'
      });
    });
  });

  describe('DashboardMetricsModel', () => {
    it('should initialize with correct default state', () => {
      const model = new DashboardMetricsModel();
      
      expect(model.getMetrics()).toBeNull();
      expect(model.isAutoRefreshEnabled()).toBe(true);
      expect(model.getRefreshInterval()).toBe(15000);
    });

    it('should format temperature correctly', () => {
      const model = new DashboardMetricsModel();
      const formatted = model.formatTemperature(23.456);
      
      expect(formatted.value).toBe(23.5);
      expect(formatted.unit).toBe('°C');
      expect(formatted.trend).toBe('stable');
    });

    it('should calculate trend correctly', () => {
      const model = new DashboardMetricsModel();
      
      // Set initial metrics
      const metrics = {
        air_temperature: { value: 20, unit: '°C' },
        humidity: { value: 60, unit: '%' },
        co2: { value: 400, unit: 'ppm' },
        yield: { average: 10, total: 100, chart_data: [] },
        space_utilization: { nursery_station: 80, cultivation_area: 70, chart_data: [] },
        last_updated: new Date()
      };
      model.setMetrics(metrics);
      
      // Test upward trend
      const upTrend = model.formatTemperature(22);
      expect(upTrend.trend).toBe('up');
      
      // Test downward trend
      const downTrend = model.formatTemperature(18);
      expect(downTrend.trend).toBe('down');
    });
  });

  describe('CropSummaryModel', () => {
    it('should filter and sort crops correctly', () => {
      const model = new CropSummaryModel();
      const crops = [
        {
          seed_type: 'Tomato',
          nursery_station_count: 10,
          cultivation_area_count: 5,
          last_seeding_date: '2024-01-01',
          last_transplanting_date: '2024-01-15',
          last_harvesting_date: '2024-02-01',
          average_age: 30,
          overdue_count: 2
        },
        {
          seed_type: 'Lettuce',
          nursery_station_count: 5,
          cultivation_area_count: 8,
          last_seeding_date: '2024-01-05',
          last_transplanting_date: '2024-01-20',
          last_harvesting_date: '2024-02-05',
          average_age: 25,
          overdue_count: 0
        }
      ];

      model.setCrops(crops);
      
      expect(model.getCrops()).toHaveLength(2);
      
      // Test filtering by overdue
      model.setFilterConfig({ overdueOnly: true });
      expect(model.getCrops()).toHaveLength(1);
      expect(model.getCrops()[0].seed_type).toBe('Tomato');
      
      // Test sorting
      model.setFilterConfig({});
      model.setSortConfig({ field: 'average_age', direction: 'desc' });
      expect(model.getCrops()[0].seed_type).toBe('Tomato');
    });

    it('should calculate statistics correctly', () => {
      const model = new CropSummaryModel();
      const crops = [
        {
          seed_type: 'Tomato',
          nursery_station_count: 10,
          cultivation_area_count: 5,
          last_seeding_date: '2024-01-01',
          last_transplanting_date: null,
          last_harvesting_date: null,
          average_age: 30,
          overdue_count: 2
        },
        {
          seed_type: 'Lettuce',
          nursery_station_count: 5,
          cultivation_area_count: 8,
          last_seeding_date: '2024-01-05',
          last_transplanting_date: null,
          last_harvesting_date: null,
          average_age: 20,
          overdue_count: 0
        }
      ];

      model.setCrops(crops);
      const stats = model.getStats();
      
      expect(stats.totalCrops).toBe(2);
      expect(stats.totalNurseryStations).toBe(15);
      expect(stats.totalCultivationAreas).toBe(13);
      expect(stats.totalOverdue).toBe(2);
      expect(stats.averageAge).toBe(25);
    });
  });

  describe('ContainerOverviewViewModel', () => {
    it('should initialize and manage state correctly', async () => {
      const { containerOverviewApiAdapter } = await import('../services/container-overview-api.adapter');
      
      // Mock API responses
      const mockContainerInfo = {
        id: 123,
        name: 'Test Container',
        type: 'physical' as const,
        tenant: { id: 1, name: 'Test Tenant' },
        status: 'active' as const
      };
      
      const mockPermissions = {
        canView: true,
        canEdit: true,
        canManage: true
      };

      vi.mocked(containerOverviewApiAdapter.getContainerInfo).mockResolvedValue(mockContainerInfo);
      vi.mocked(containerOverviewApiAdapter.checkContainerPermissions).mockResolvedValue(mockPermissions);

      const viewModel = new ContainerOverviewViewModel(123);
      let currentState = viewModel.getState();
      
      expect(currentState.isLoading).toBe(false);
      expect(currentState.containerInfo).toBeNull();

      // Initialize
      await viewModel.initialize();
      currentState = viewModel.getState();
      
      expect(currentState.containerInfo).toEqual(mockContainerInfo);
      expect(currentState.isLoading).toBe(false);
    });
  });

  describe('useContainerOverview hook', () => {
    it('should provide correct initial state and actions', () => {
      const { result } = renderHook(() => useContainerOverview({
        containerId: 123
      }));

      expect(result.current.state.activeTab).toBe('overview');
      expect(result.current.containerDisplayName).toBe('Loading...');
      expect(typeof result.current.switchTab).toBe('function');
      expect(typeof result.current.refreshData).toBe('function');
    });
  });

  describe('useDashboardMetrics hook', () => {
    it('should handle time range changes correctly', async () => {
      const { metricsApiAdapter } = await import('../services/metrics-api.adapter');
      
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

      const mockDashboardMetrics = {
        air_temperature: { value: 23.5, unit: '°C' },
        humidity: { value: 65, unit: '%' },
        co2: { value: 400, unit: 'ppm' },
        yield: { average: 5.2, total: 5.2, chart_data: [] },
        space_utilization: { nursery_station: 45, cultivation_area: 30, chart_data: [] },
        last_updated: new Date()
      };

      vi.mocked(metricsApiAdapter.getAggregatedMetrics).mockResolvedValue({
        snapshots: mockSnapshots,
        aggregated: {
          air_temperature: { avg: 23.5, min: 20, max: 25 },
          humidity: { avg: 65, min: 60, max: 70 },
          co2: { avg: 400, min: 350, max: 450 },
          yield_kg: { total: 5.2, avg: 5.2 },
          space_utilization_pct: { avg: 75, min: 70, max: 80 }
        }
      });

      vi.mocked(metricsApiAdapter.transformToDashboardMetrics).mockReturnValue(mockDashboardMetrics);

      const { result } = renderHook(() => useDashboardMetrics({
        containerId: 123,
        autoRefresh: false
      }));

      await act(async () => {
        await result.current.setTimeRange('month');
      });

      expect(metricsApiAdapter.getAggregatedMetrics).toHaveBeenCalledWith(123, 'month', 'day');
    });
  });
});

// Integration test for complete data flow
describe('Container Overview Integration', () => {
  it('should handle complete initialization flow', async () => {
    const { containerOverviewApiAdapter } = await import('../services/container-overview-api.adapter');
    const { metricsApiAdapter } = await import('../services/metrics-api.adapter');

    // Mock complete API responses
    const mockContainerInfo = {
      id: 123,
      name: 'Test Container',
      type: 'physical' as const,
      tenant: { id: 1, name: 'Test Tenant' },
      status: 'active' as const
    };

    const mockOverview = {
      container: mockContainerInfo as any,
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

    vi.mocked(containerOverviewApiAdapter.getContainerInfo).mockResolvedValue(mockContainerInfo);
    vi.mocked(containerOverviewApiAdapter.getContainerOverview).mockResolvedValue(mockOverview);
    vi.mocked(containerOverviewApiAdapter.checkContainerPermissions).mockResolvedValue({
      canView: true,
      canEdit: true,
      canManage: true
    });

    // Test the complete flow through the hook
    const { result } = renderHook(() => useContainerOverview({
      containerId: 123
    }));

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.containerDisplayName).toBe('Test Container');
    expect(result.current.canViewContainer).toBe(true);
  });
});
