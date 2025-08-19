import { useState, useCallback, useEffect } from 'react';
import type { PerformanceMetrics, MetricsFilters } from '../types';
import { containerService } from '../services';

interface UseContainerMetricsOptions {
  initialTimeRange?: 'week' | 'month' | 'quarter' | 'year';
  autoRefreshInterval?: number; // in milliseconds
  onMetricsChange?: (metrics: PerformanceMetrics | null) => void;
}

interface UseContainerMetricsResult {
  metrics: PerformanceMetrics | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  timeRange: 'week' | 'month' | 'quarter' | 'year';
  lastRefresh: Date | null;
  setTimeRange: (range: 'week' | 'month' | 'quarter' | 'year') => Promise<void>;
  refreshMetrics: () => Promise<void>;
  loadMetrics: (filters?: Partial<MetricsFilters>) => Promise<void>;
  clearError: () => void;
}

export const useContainerMetrics = ({
  initialTimeRange = 'week',
  autoRefreshInterval,
  onMetricsChange
}: UseContainerMetricsOptions = {}): UseContainerMetricsResult => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRangeState] = useState<'week' | 'month' | 'quarter' | 'year'>(initialTimeRange);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  const loadMetrics = useCallback(async (filters?: Partial<MetricsFilters>) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const metricsFilters: MetricsFilters = {
        timeRange: filters?.timeRange || timeRange,
        type: filters?.type || 'all',
        containerIds: filters?.containerIds
      };

      const data = await containerService.getPerformanceMetrics(metricsFilters);
      setMetrics(data);
      setLastRefresh(new Date());
      onMetricsChange?.(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load metrics';
      setError(errorMessage);
      setIsError(true);
      onMetricsChange?.(null);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, onMetricsChange]);

  const setTimeRange = useCallback(async (range: 'week' | 'month' | 'quarter' | 'year') => {
    setTimeRangeState(range);
    await loadMetrics({ timeRange: range });
  }, [loadMetrics]);

  const refreshMetrics = useCallback(async () => {
    await loadMetrics();
  }, [loadMetrics]);

  const clearError = useCallback(() => {
    setIsError(false);
    setError(null);
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefreshInterval && autoRefreshInterval > 0) {
      const interval = window.setInterval(() => {
        if (!isLoading) {
          loadMetrics();
        }
      }, autoRefreshInterval);

      setRefreshInterval(interval);

      return () => {
        clearInterval(interval);
      };
    }
  }, [autoRefreshInterval, isLoading, loadMetrics]);

  // Load initial metrics
  useEffect(() => {
    loadMetrics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  return {
    metrics,
    isLoading,
    isError,
    error,
    timeRange,
    lastRefresh,
    setTimeRange,
    refreshMetrics,
    loadMetrics,
    clearError
  };
};

// Specialized hook for card interactions
export const useMetricCardInteractions = () => {
  const [selectedCardType, setSelectedCardType] = useState<'physical' | 'virtual' | null>(null);

  const selectCard = useCallback((type: 'physical' | 'virtual') => {
    setSelectedCardType(prev => prev === type ? null : type);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCardType(null);
  }, []);

  const isCardSelected = useCallback((type: 'physical' | 'virtual'): boolean => {
    return selectedCardType === type;
  }, [selectedCardType]);

  const hasSelection = selectedCardType !== null;

  return {
    selectedCardType,
    selectCard,
    clearSelection,
    isCardSelected,
    hasSelection
  };
};

// Hook for time range management
export const useTimeRangeSelector = (
  initialRange: 'week' | 'month' | 'quarter' | 'year' = 'week',
  onRangeChange?: (range: 'week' | 'month' | 'quarter' | 'year') => void
) => {
  const [selectedRange, setSelectedRange] = useState<'week' | 'month' | 'quarter' | 'year'>(initialRange);

  const changeRange = useCallback((range: 'week' | 'month' | 'quarter' | 'year') => {
    setSelectedRange(range);
    onRangeChange?.(range);
  }, [onRangeChange]);

  const timeRangeOptions = [
    { value: 'week' as const, label: 'Week' },
    { value: 'month' as const, label: 'Month' },
    { value: 'quarter' as const, label: 'Quarter' },
    { value: 'year' as const, label: 'Year' }
  ];

  return {
    selectedRange,
    changeRange,
    timeRangeOptions,
    isRangeSelected: (range: 'week' | 'month' | 'quarter' | 'year') => selectedRange === range
  };
};