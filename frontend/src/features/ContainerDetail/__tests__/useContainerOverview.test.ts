// Hook tests for useContainerOverview
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useContainerOverview } from '../hooks/useContainerOverview';
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
      chart_data: [],
    },
    space_utilization: {
      nursery_station: 80,
      cultivation_area: 75,
      chart_data: [],
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

describe('useContainerOverview Hook', () => {
  const containerId = 123;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Hook Initialization', () => {
    it('should initialize with default state', () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);

      const { result } = renderHook(() => useContainerOverview(containerId));

      // Check initial state
      expect(result.current.state.overview).toBeNull();
      expect(result.current.state.timeRange).toBe('week');
      expect(result.current.state.activityPage).toBe(1);
      expect(result.current.containerInfo).toBeNull();
    });

    it('should load data on mount', async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);

      const { result } = renderHook(() => useContainerOverview(containerId));

      // Wait for data loading
      await waitFor(() => {
        expect(result.current.state.overview).not.toBeNull();
      });

      expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenCalledWith(
        containerId,
        { time_range: 'week', metric_interval: 'day' }
      );

      expect(result.current.containerInfo).toEqual(mockContainerOverview.container);
    });

    it('should start metrics polling on mount', async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);

      renderHook(() => useContainerOverview(containerId));

      // Wait for initial load
      await waitFor(() => {
        expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenCalledTimes(1);
      });

      // Fast-forward time to trigger polling
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      // Should have polled for metrics
      await waitFor(() => {
        expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Data Loading Actions', () => {
    it('should reload overview data when requested', async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);

      const { result } = renderHook(() => useContainerOverview(containerId));

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.state.overview).not.toBeNull();
      });

      // Clear mock calls
      vi.clearAllMocks();

      // Reload data
      await act(async () => {
        await result.current.loadOverviewData();
      });

      expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenCalledTimes(1);
    });

    it('should refresh metrics when requested', async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);

      const { result } = renderHook(() => useContainerOverview(containerId));

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.state.overview).not.toBeNull();
      });

      // Clear mock calls
      vi.clearAllMocks();

      // Refresh metrics
      await act(async () => {
        await result.current.refreshMetrics();
      });

      expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenCalledTimes(1);
    });
  });

  describe('Time Range Management', () => {
    it('should change time range and reload data', async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);

      const { result } = renderHook(() => useContainerOverview(containerId));

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.state.overview).not.toBeNull();
      });

      // Change time range
      await act(async () => {
        await result.current.changeTimeRange('month');
      });

      // Should update state and reload data
      expect(result.current.state.timeRange).toBe('month');
      expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenCalledWith(
        containerId,
        { time_range: 'month', metric_interval: 'day' }
      );
    });

    it('should provide time selector props', async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);

      const { result } = renderHook(() => useContainerOverview(containerId));

      await waitFor(() => {
        expect(result.current.state.overview).not.toBeNull();
      });

      const timeSelectorProps = result.current.timeSelectorProps;
      expect(timeSelectorProps.selectedRange).toBe('week');
      expect(typeof timeSelectorProps.onRangeChange).toBe('function');
    });
  });

  describe('Activity Management', () => {
    it('should load more activities', async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);
      vi.mocked(containerDetailApiAdaptor.getActivityLogs).mockResolvedValue({
        activities: [
          {
            id: 2,
            container_id: 123,
            timestamp: '2023-01-02T12:00:00Z',
            action_type: 'harvesting',
            actor_type: 'user',
            actor_id: 'user456',
            description: 'Harvested batch',
          },
        ],
        pagination: { page: 2, limit: 20, total: 2, total_pages: 1 },
      });

      const { result } = renderHook(() => useContainerOverview(containerId));

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.state.overview).not.toBeNull();
      });

      // Load more activities
      await act(async () => {
        await result.current.loadMoreActivities();
      });

      expect(containerDetailApiAdaptor.getActivityLogs).toHaveBeenCalledWith(
        containerId,
        { page: 2, limit: 20 }
      );

      // Should have combined activities
      expect(result.current.state.overview?.recent_activity).toHaveLength(2);
    });
  });

  describe('Derived Data Props', () => {
    beforeEach(async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);
    });

    it('should provide navigation props', async () => {
      const { result } = renderHook(() => useContainerOverview(containerId));

      await waitFor(() => {
        expect(result.current.state.overview).not.toBeNull();
      });

      const navProps = result.current.navigationProps;
      expect(navProps.containerName).toBe('Test Container');
      expect(typeof navProps.onBreadcrumbClick).toBe('function');
    });

    it('should provide status header props', async () => {
      const { result } = renderHook(() => useContainerOverview(containerId));

      await waitFor(() => {
        expect(result.current.state.overview).not.toBeNull();
      });

      const headerProps = result.current.statusHeaderProps;
      expect(headerProps).toMatchObject({
        containerType: 'physical',
        status: 'active',
        statusVariant: 'active',
      });
    });

    it('should provide metric cards', async () => {
      const { result } = renderHook(() => useContainerOverview(containerId));

      await waitFor(() => {
        expect(result.current.state.overview).not.toBeNull();
      });

      const metricCards = result.current.metricCards;
      expect(metricCards).toHaveLength(4);
      expect(metricCards[0]).toMatchObject({
        title: 'Air Temperature',
        value: 21.5,
        unit: '°C',
        iconName: 'thermostat',
      });
    });

    it('should provide crops table data', async () => {
      const { result } = renderHook(() => useContainerOverview(containerId));

      await waitFor(() => {
        expect(result.current.state.overview).not.toBeNull();
      });

      const cropsData = result.current.cropsTableData;
      expect(cropsData).toHaveLength(1);
      expect(cropsData[0].cells[0].content).toBe('Lettuce');
    });

    it('should provide activity timeline', async () => {
      const { result } = renderHook(() => useContainerOverview(containerId));

      await waitFor(() => {
        expect(result.current.state.overview).not.toBeNull();
      });

      const timeline = result.current.activityTimeline;
      expect(timeline).toHaveLength(1);
      expect(timeline[0]).toMatchObject({
        id: 1,
        actionType: 'seeding',
        description: 'Seeded new batch of lettuce',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      const errorMessage = 'Failed to load data';
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useContainerOverview(containerId));

      await waitFor(() => {
        expect(result.current.errors.overview).toBe(errorMessage);
      });

      expect(result.current.state.overview).toBeNull();
    });

    it('should clear errors when requested', async () => {
      const errorMessage = 'Failed to load data';
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useContainerOverview(containerId));

      await waitFor(() => {
        expect(result.current.errors.overview).toBe(errorMessage);
      });

      act(() => {
        result.current.clearError('overview');
      });

      expect(result.current.errors.overview).toBeUndefined();
    });
  });

  describe('Loading States', () => {
    it('should provide loading states', async () => {
      // Mock slow API response
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockContainerOverview), 100))
      );

      const { result } = renderHook(() => useContainerOverview(containerId));

      // Should be loading initially
      expect(result.current.isLoading.overview).toBe(true);

      // Fast-forward and wait for completion
      act(() => {
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.isLoading.overview).toBe(false);
      });
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on unmount', async () => {
      vi.mocked(containerDetailApiAdaptor.getContainerOverview).mockResolvedValue(mockContainerOverview);

      const { unmount } = renderHook(() => useContainerOverview(containerId));

      // Wait for initial load
      await waitFor(() => {
        expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenCalled();
      });

      // Unmount component
      unmount();

      // Fast-forward time - should not trigger any more polling
      act(() => {
        vi.advanceTimersByTime(60000);
      });

      // Should not have made additional API calls
      expect(containerDetailApiAdaptor.getContainerOverview).toHaveBeenCalledTimes(1);
    });
  });
});