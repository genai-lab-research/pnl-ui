/**
 * Tests for Container Detail hooks
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useMetricsPolling, useMetricFormatters } from '../hooks/useMetricsPolling';
import { useActivityScroll, useActivityGrouping, useActivityFilters } from '../hooks/useActivityScroll';
import { containerDetailService } from '../services/containerDetailService';
import type { ActivityLogEntry } from '../types/container-detail';

jest.mock('../services/containerDetailService');

describe('useMetricsPolling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start polling and fetch metrics', async () => {
    const mockSnapshots = [
      { id: 1, airTemperature: 23, humidity: 55, co2: 800, yieldKg: 2.5, spaceUtilizationPct: 75 },
    ];
    const mockSummary = {
      currentMetrics: { airTemperature: 23, humidity: 55, co2: 800, yieldKg: 2.5, spaceUtilizationPct: 75 },
      cropCounts: { totalCrops: 300, nurseryCrops: 100, cultivationCrops: 200, overdueCrops: 5 },
      activityCount: 10,
      lastUpdated: new Date(),
    };

    (containerDetailService.getMetricSnapshots as jest.Mock).mockResolvedValue(mockSnapshots);
    (containerDetailService.getDashboardSummary as jest.Mock).mockResolvedValue(mockSummary);

    const { result } = renderHook(() => useMetricsPolling({
      containerId: 123,
      enabled: true,
      intervalSeconds: 30,
    }));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.metrics).toEqual(mockSnapshots);
      expect(result.current.summary).toEqual(mockSummary);
      expect(result.current.isPolling).toBe(true);
    });

    // Advance timer and check for second fetch
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(containerDetailService.getMetricSnapshots).toHaveBeenCalledTimes(2);
    });
  });

  it('should stop polling when disabled', () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useMetricsPolling({ containerId: 123, enabled }),
      { initialProps: { enabled: true } }
    );

    expect(result.current.isPolling).toBe(true);

    // Disable polling
    rerender({ enabled: false });

    expect(result.current.isPolling).toBe(false);
  });

  it('should handle errors with retry logic', async () => {
    const mockError = new Error('Network error');
    (containerDetailService.getMetricSnapshots as jest.Mock).mockRejectedValue(mockError);
    (containerDetailService.getDashboardSummary as jest.Mock).mockRejectedValue(mockError);

    const onError = jest.fn();
    const { result } = renderHook(() => useMetricsPolling({
      containerId: 123,
      enabled: true,
      onError,
    }));

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });

    // Check retry with exponential backoff
    act(() => {
      jest.advanceTimersByTime(2000); // First retry after 2s
    });

    await waitFor(() => {
      expect(containerDetailService.getMetricSnapshots).toHaveBeenCalledTimes(2);
    });
  });
});

describe('useMetricFormatters', () => {
  it('should format temperature correctly', () => {
    const { result } = renderHook(() => useMetricFormatters());

    expect(result.current.formatTemperature(23.5)).toBe('23.5°C');
    expect(result.current.formatTemperature(23.5, 'fahrenheit')).toBe('74.3°F');
  });

  it('should format other metrics correctly', () => {
    const { result } = renderHook(() => useMetricFormatters());

    expect(result.current.formatHumidity(55.5)).toBe('56%');
    expect(result.current.formatCO2(800.2)).toBe('800 ppm');
    expect(result.current.formatYield(2.567)).toBe('2.6 kg');
    expect(result.current.formatYield(2.567, 'lbs')).toBe('5.7 lbs');
    expect(result.current.formatSpaceUtilization(77.5)).toBe('78%');
  });
});

describe('useActivityScroll', () => {
  const mockActivities: ActivityLogEntry[] = [
    {
      id: 1,
      containerId: 123,
      timestamp: new Date(),
      actionType: 'container_updated',
      actorType: 'user',
      actorId: 'user-1',
      description: 'Updated settings',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load activities on mount', async () => {
    (containerDetailService.getActivityLogs as jest.Mock).mockResolvedValue({
      activities: mockActivities,
      hasMore: true,
      total: 50,
    });

    const { result } = renderHook(() => useActivityScroll({
      containerId: 123,
      enabled: true,
    }));

    await waitFor(() => {
      expect(result.current.activities).toEqual(mockActivities);
      expect(result.current.hasMore).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should load more activities when called', async () => {
    const page1Activities = [{ ...mockActivities[0], id: 1 }];
    const page2Activities = [{ ...mockActivities[0], id: 2 }];

    (containerDetailService.getActivityLogs as jest.Mock)
      .mockResolvedValueOnce({ activities: page1Activities, hasMore: true, total: 50 })
      .mockResolvedValueOnce({ activities: page2Activities, hasMore: false, total: 50 });

    const { result } = renderHook(() => useActivityScroll({
      containerId: 123,
      enabled: true,
    }));

    await waitFor(() => {
      expect(result.current.activities).toHaveLength(1);
    });

    // Load more
    await act(async () => {
      await result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.activities).toHaveLength(2);
      expect(result.current.hasMore).toBe(false);
    });
  });

  it('should refresh activities when called', async () => {
    (containerDetailService.getActivityLogs as jest.Mock).mockResolvedValue({
      activities: mockActivities,
      hasMore: false,
      total: 1,
    });

    const { result } = renderHook(() => useActivityScroll({
      containerId: 123,
      enabled: true,
    }));

    await waitFor(() => {
      expect(result.current.activities).toHaveLength(1);
    });

    // Refresh
    await act(async () => {
      await result.current.refresh();
    });

    expect(containerDetailService.getActivityLogs).toHaveBeenCalledTimes(2);
  });
});

describe('useActivityGrouping', () => {
  it('should group activities by date correctly', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const activities: ActivityLogEntry[] = [
      {
        id: 1,
        containerId: 123,
        timestamp: today,
        actionType: 'container_updated',
        actorType: 'user',
        actorId: 'user-1',
        description: 'Today activity',
      },
      {
        id: 2,
        containerId: 123,
        timestamp: yesterday,
        actionType: 'metric_recorded',
        actorType: 'system',
        actorId: 'system',
        description: 'Yesterday activity',
      },
      {
        id: 3,
        containerId: 123,
        timestamp: lastWeek,
        actionType: 'crop_seeded',
        actorType: 'user',
        actorId: 'user-2',
        description: 'Last week activity',
      },
    ];

    const { result } = renderHook(() => useActivityGrouping(activities));

    expect(result.current.size).toBe(3);
    expect(result.current.get('Today')).toHaveLength(1);
    expect(result.current.get('Yesterday')).toHaveLength(1);
    expect(Array.from(result.current.keys())[2]).toContain(lastWeek.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  });
});

describe('useActivityFilters', () => {
  it('should manage filters correctly', () => {
    const { result } = renderHook(() => useActivityFilters());

    expect(result.current.filters).toEqual({});

    // Set date range
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    act(() => {
      result.current.setDateRange(startDate, endDate);
    });

    expect(result.current.filters.startDate).toEqual(startDate);
    expect(result.current.filters.endDate).toEqual(endDate);

    // Set action type
    act(() => {
      result.current.setActionType('container_updated');
    });

    expect(result.current.filters.actionType).toBe('container_updated');

    // Set actor type
    act(() => {
      result.current.setActorType('user');
    });

    expect(result.current.filters.actorType).toBe('user');

    // Clear filters
    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({});
  });
});