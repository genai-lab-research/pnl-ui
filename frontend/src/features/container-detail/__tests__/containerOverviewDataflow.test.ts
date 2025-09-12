// Dataflow tests for Container Overview functionality
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContainerOverviewViewModel } from '../viewmodels/ContainerOverviewViewModel';
import { containerDetailApiAdaptor } from '../services';

// Mock the API adaptor
vi.mock('../services', () => ({
  containerDetailApiAdaptor: {
    getContainerOverview: vi.fn(),
    getActivityLogs: vi.fn(),
  },
}));

const mockContainerOverview = {
  container: {
    id: 123,
    name: 'Test Container',
    type: 'physical',
    tenant: { id: 1, name: 'Test Tenant' },
    status: 'active',
    location: { name: 'Test Location' },
  },
  dashboard_metrics: {
    air_temperature: 21.5,
    humidity: 65,
    co2: 400,
    yield: {
      average: 12.5,
      total: 500,
      chart_data: [
        { date: '2023-01-01', value: 10, is_current_period: true, is_future: false }
      ],
    },
    space_utilization: {
      nursery_station: 80,
      cultivation_area: 75,
      chart_data: [
        { date: '2023-01-01', nursery_value: 80, cultivation_value: 75, is_current_period: true, is_future: false }
      ],
    },
  },
  crops_summary: [
    {
      seed_type: 'Lettuce',
      nursery_station_count: 12,
      cultivation_area_count: 8,
      last_seeding_date: '2023-01-01',
      last_transplanting_date: '2023-01-02',
      last_harvesting_date: '2023-01-03',
      average_age: 25,
      overdue_count: 0,
    },
  ],
  recent_activity: [
    {
      id: 1,
      container_id: 123,
      timestamp: '2023-01-01T12:00:00Z',
      action_type: 'seeding',
      actor_type: 'user',
      actor_id: 'user123',
      description: 'Seeded new batch of lettuce',
    },
  ],
};

describe('Container Overview Dataflow', () => {
  let viewModel: ContainerOverviewViewModel;
  const containerId = 123;

  beforeEach(() => {
    vi.clearAllMocks();
    viewModel = new ContainerOverviewViewModel(containerId);
  });

  afterEach(() => {
    viewModel.dispose();
  });

  describe('Initial Data Loading', () => {
    it('should load overview data successfully', async () => {
      // Mock API response
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);

      // Subscribe to state changes
      const stateChanges: any[] = [];
      viewModel.subscribe((state) => stateChanges.push({ ...state }));

      // Load data
      await viewModel.loadOverviewData();

      // Verify API call
      expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenCalledWith(
        containerId,
        { time_range: 'week', metric_interval: 'day' }
      );

      // Verify state changes
      expect(stateChanges).toHaveLength(2); // Loading start + data loaded
      
      const finalState = stateChanges[1];
      expect(finalState.overview).toEqual(mockContainerOverview);
      expect(finalState.isLoading.overview).toBe(false);
      expect(finalState.errors.overview).toBeUndefined();
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      const errorMessage = 'Failed to load container data';
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockRejectedValue(new Error(errorMessage));

      // Subscribe to state changes
      const stateChanges: any[] = [];
      viewModel.subscribe((state) => stateChanges.push({ ...state }));

      // Load data
      await viewModel.loadOverviewData();

      // Verify error state
      const finalState = stateChanges[1];
      expect(finalState.overview).toBeNull();
      expect(finalState.isLoading.overview).toBe(false);
      expect(finalState.errors.overview).toBe(errorMessage);
    });
  });

  describe('Metrics Refresh', () => {
    beforeEach(async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);
      await viewModel.loadOverviewData();
    });

    it('should refresh metrics data', async () => {
      // Mock updated metrics
      const updatedOverview = {
        ...mockContainerOverview,
        dashboard_metrics: {
          ...mockContainerOverview.dashboard_metrics,
          air_temperature: 22.0,
          humidity: 68,
        },
      };
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(updatedOverview);

      // Subscribe to state changes
      const stateChanges: any[] = [];
      viewModel.subscribe((state) => stateChanges.push({ ...state }));

      // Refresh metrics
      await viewModel.refreshMetrics();

      // Verify updated metrics
      const finalState = stateChanges[1];
      expect(finalState.overview?.dashboard_metrics.air_temperature).toBe(22.0);
      expect(finalState.overview?.dashboard_metrics.humidity).toBe(68);
    });
  });

  describe('Time Range Changes', () => {
    beforeEach(async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);
      await viewModel.loadOverviewData();
    });

    it('should reload data when time range changes', async () => {
      // Subscribe to state changes
      const stateChanges: any[] = [];
      viewModel.subscribe((state) => stateChanges.push({ ...state }));

      // Change time range
      await viewModel.changeTimeRange('month');

      // Verify API called with new time range
      expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenLastCalledWith(
        containerId,
        { time_range: 'month', metric_interval: 'day' }
      );

      // Verify state updated
      const finalState = stateChanges[1];
      expect(finalState.timeRange).toBe('month');
    });

    it('should not reload if time range is the same', async () => {
      vi.clearAllMocks();

      // Try to change to same time range
      await viewModel.changeTimeRange('week');

      // Should not make API call
      expect(containerDetailApiAdaptor.getContainerOverview).not.toHaveBeenCalled();
    });
  });

  describe('Activity Loading', () => {
    beforeEach(async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);
      await viewModel.loadOverviewData();
    });

    it('should load more activities', async () => {
      const moreActivities = {
        activities: [
          {
            id: 2,
            container_id: 123,
            timestamp: '2023-01-02T12:00:00Z',
            action_type: 'harvesting',
            actor_type: 'user',
            actor_id: 'user456',
            description: 'Harvested batch of lettuce',
          },
        ],
        pagination: { page: 2, limit: 20, total: 2, total_pages: 1 },
      };

      vi.mocked(containerDetailApiAdaptor.getActivityLogs).mockResolvedValue(moreActivities);

      // Load more activities
      await viewModel.loadMoreActivities();

      // Verify API call
      expect(containerDetailApiAdaptor.getActivityLogs).toHaveBeenCalledWith(
        containerId,
        { page: 2, limit: 20 }
      );

      // Verify activities were appended
      const state = viewModel.getState();
      expect(state.overview?.recent_activity).toHaveLength(2);
      expect(state.activityPage).toBe(2);
    });
  });

  describe('Derived Data Generation', () => {
    beforeEach(async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);
      await viewModel.loadOverviewData();
    });

    it('should generate metric cards', () => {
      const metricCards = viewModel.getMetricCards();

      expect(metricCards).toHaveLength(4);
      expect(metricCards[0]).toEqual({
        title: 'Air Temperature',
        value: 21.5,
        unit: '°C',
        iconName: 'thermostat',
        delta: undefined, // Simplified for testing
        deltaDirection: 'flat',
      });
    });

    it('should generate crops table data', () => {
      const cropsData = viewModel.getCropsTableData();

      expect(cropsData).toHaveLength(1);
      expect(cropsData[0].cells[0]).toEqual({
        id: 'seed_type',
        type: 'text',
        content: 'Lettuce',
        fontWeight: 'medium',
        flex: true,
      });
    });

    it('should generate activity timeline', () => {
      const timeline = viewModel.getActivityTimeline();

      expect(timeline).toHaveLength(1);
      expect(timeline[0]).toMatchObject({
        id: 1,
        actionType: 'seeding',
        description: 'Seeded new batch of lettuce',
      });
    });

    it('should generate navigation props', () => {
      const navProps = viewModel.getNavigationProps();

      expect(navProps.containerName).toBe('Test Container');
      expect(typeof navProps.onBreadcrumbClick).toBe('function');
    });

    it('should generate status header props', () => {
      const headerProps = viewModel.getStatusHeaderProps();

      expect(headerProps).toMatchObject({
        containerType: 'physical',
        status: 'active',
        statusVariant: 'active',
      });
    });
  });

  describe('Real-time Metrics Polling', () => {
    beforeEach(async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);
      await viewModel.loadOverviewData();
    });

    it('should start and stop metrics polling', () => {
      // Use fake timers
      vi.useFakeTimers();

      viewModel.startMetricsPolling();

      // Fast-forward time
      vi.advanceTimersByTime(30000);

      // Should have called refresh
      expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenCalledTimes(2);

      // Stop polling
      viewModel.stopMetricsPolling();

      // Fast-forward time again
      vi.advanceTimersByTime(30000);

      // Should not call refresh again
      expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    it('should clear specific errors', async () => {
      // Set up error state
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockRejectedValue(new Error('Test error'));
      await viewModel.loadOverviewData();

      let state = viewModel.getState();
      expect(state.errors.overview).toBeDefined();

      // Clear error
      viewModel.clearError('overview');

      state = viewModel.getState();
      expect(state.errors.overview).toBeUndefined();
    });
  });

  describe('Component Integration', () => {
    it('should provide loading states for UI', async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockImplementation(
        () => new Promise(() => {}) // Never resolves to keep loading
      );

      const loadingPromise = viewModel.loadOverviewData();
      
      const loadingStates = viewModel.getLoadingStates();
      expect(loadingStates.overview).toBe(true);

      // Don't await to keep test synchronous
      loadingPromise.catch(() => {});
    });

    it('should provide error states for UI', async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockRejectedValue(new Error('Test error'));
      await viewModel.loadOverviewData();

      const errors = viewModel.getErrors();
      expect(errors.overview).toBe('Test error');
    });
  });
});