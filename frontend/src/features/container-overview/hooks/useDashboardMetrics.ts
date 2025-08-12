// Custom hook for Dashboard Metrics logic
// Manages metrics data, real-time updates, and time range filtering

import { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardMetricsViewModel, DashboardMetricsState } from '../viewmodels/dashboard-metrics.viewmodel';
import { TimeRange, MetricInterval } from '../models/dashboard-metrics.model';

export interface UseDashboardMetricsOptions {
  containerId: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  initialTimeRange?: TimeRange;
  initialInterval?: MetricInterval;
  onError?: (error: string) => void;
}

export interface UseDashboardMetricsResult {
  // State
  state: DashboardMetricsState;
  
  // Actions
  loadMetrics: (timeRange?: TimeRange, interval?: MetricInterval) => Promise<void>;
  refreshMetrics: () => Promise<void>;
  setTimeRange: (timeRange: TimeRange) => Promise<void>;
  setMetricInterval: (interval: MetricInterval) => Promise<void>;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  toggleAutoRefresh: () => void;
  setRefreshInterval: (intervalMs: number) => void;
  exportMetricsData: () => Promise<string>;
  
  // Data access
  currentMetrics: ReturnType<DashboardMetricsViewModel['getCurrentMetrics']>;
  formattedMetrics: ReturnType<DashboardMetricsViewModel['getFormattedMetrics']>;
  chartData: ReturnType<DashboardMetricsViewModel['getChartData']>;
  lastUpdatedText: string;
  areMetricsStale: boolean;
  
  // Options
  timeRangeOptions: Array<{ value: TimeRange; label: string }>;
  intervalOptions: Array<{ value: MetricInterval; label: string }>;
  
  // State checks
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export function useDashboardMetrics(options: UseDashboardMetricsOptions): UseDashboardMetricsResult {
  const {
    containerId,
    autoRefresh = false, // FIXED: Disabled auto-refresh to prevent request spam
    refreshInterval = 30000, // FIXED: Increased interval to 30 seconds
    initialTimeRange = 'week',
    initialInterval = 'day',
    onError
  } = options;

  const viewModelRef = useRef<DashboardMetricsViewModel | null>(null);
  const [state, setState] = useState<DashboardMetricsState>({
    metrics: null,
    isLoading: true,
    error: null,
    timeRange: initialTimeRange,
    metricInterval: initialInterval,
    autoRefreshEnabled: autoRefresh,
    refreshInterval,
    lastUpdated: null
  });

  // Initialize ViewModel
  useEffect(() => {
    const viewModel = new DashboardMetricsViewModel(containerId);
    viewModelRef.current = viewModel;

    // Set up state change listener
    viewModel.setStateChangeListener((newState) => {
      setState(newState);
    });

    // Set initial refresh interval
    viewModel.setRefreshInterval(refreshInterval);

    // Initialize data
    viewModel.initialize().catch((error) => {
      console.error('Failed to initialize dashboard metrics:', error);
      if (onError) {
        onError(error.message);
      }
    });

    // Cleanup on unmount
    return () => {
      viewModel.destroy();
    };
  }, [containerId]); // FIXED: Only depend on containerId to prevent re-initialization

  // Auto-refresh management
  useEffect(() => {
    if (viewModelRef.current) {
      if (autoRefresh) {
        viewModelRef.current.startAutoRefresh();
      } else {
        viewModelRef.current.stopAutoRefresh();
      }
    }
  }, [autoRefresh]);

  // Actions
  const loadMetrics = useCallback(async (timeRange?: TimeRange, interval?: MetricInterval) => {
    if (viewModelRef.current) {
      await viewModelRef.current.loadMetrics(timeRange, interval);
    }
  }, []);

  const refreshMetrics = useCallback(async () => {
    if (viewModelRef.current) {
      await viewModelRef.current.refreshMetrics();
    }
  }, []);

  const setTimeRange = useCallback(async (timeRange: TimeRange) => {
    if (viewModelRef.current) {
      await viewModelRef.current.setTimeRange(timeRange);
    }
  }, []);

  const setMetricInterval = useCallback(async (interval: MetricInterval) => {
    if (viewModelRef.current) {
      await viewModelRef.current.setMetricInterval(interval);
    }
  }, []);

  const startAutoRefresh = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.startAutoRefresh();
    }
  }, []);

  const stopAutoRefresh = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.stopAutoRefresh();
    }
  }, []);

  const toggleAutoRefresh = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.toggleAutoRefresh();
    }
  }, []);

  const setRefreshIntervalCallback = useCallback((intervalMs: number) => {
    if (viewModelRef.current) {
      viewModelRef.current.setRefreshInterval(intervalMs);
    }
  }, []);

  const exportMetricsData = useCallback(async () => {
    if (viewModelRef.current) {
      return await viewModelRef.current.exportMetricsData();
    }
    throw new Error('ViewModel not initialized');
  }, []);

  // Data access
  const currentMetrics = viewModelRef.current?.getCurrentMetrics() || null;
  const formattedMetrics = viewModelRef.current?.getFormattedMetrics() || null;
  const chartData = viewModelRef.current?.getChartData() || null;
  const lastUpdatedText = viewModelRef.current?.getLastUpdatedText() || '';
  const areMetricsStale = viewModelRef.current?.areMetricsStale() || false;

  // Options
  const timeRangeOptions = viewModelRef.current?.getTimeRangeOptions() || [];
  const intervalOptions = viewModelRef.current?.getIntervalOptions() || [];

  // State checks
  const isLoading = state.isLoading;
  const hasError = Boolean(state.error);
  const errorMessage = state.error;

  return {
    // State
    state,
    
    // Actions
    loadMetrics,
    refreshMetrics,
    setTimeRange,
    setMetricInterval,
    startAutoRefresh,
    stopAutoRefresh,
    toggleAutoRefresh,
    setRefreshInterval: setRefreshIntervalCallback,
    exportMetricsData,
    
    // Data access
    currentMetrics,
    formattedMetrics,
    chartData,
    lastUpdatedText,
    areMetricsStale,
    
    // Options
    timeRangeOptions,
    intervalOptions,
    
    // State checks
    isLoading,
    hasError,
    errorMessage
  };
}

// Hook for metric status monitoring
export function useMetricStatus(
  metricType: string,
  value: number | undefined,
  thresholds?: {
    warning?: { min?: number; max?: number };
    critical?: { min?: number; max?: number };
  }
) {
  const [status, setStatus] = useState<'optimal' | 'warning' | 'critical'>('optimal');
  const [statusColor, setStatusColor] = useState<'success' | 'warning' | 'error'>('success');

  useEffect(() => {
    if (value === undefined) {
      setStatus('optimal');
      setStatusColor('success');
      return;
    }

    if (thresholds?.critical) {
      const { min: criticalMin, max: criticalMax } = thresholds.critical;
      if ((criticalMin !== undefined && value < criticalMin) || 
          (criticalMax !== undefined && value > criticalMax)) {
        setStatus('critical');
        setStatusColor('error');
        return;
      }
    }

    if (thresholds?.warning) {
      const { min: warningMin, max: warningMax } = thresholds.warning;
      if ((warningMin !== undefined && value < warningMin) || 
          (warningMax !== undefined && value > warningMax)) {
        setStatus('warning');
        setStatusColor('warning');
        return;
      }
    }

    setStatus('optimal');
    setStatusColor('success');
  }, [value, thresholds]);

  return { status, statusColor };
}

// Hook for chart data formatting
export function useChartDataFormatter() {
  const formatForBarChart = useCallback((data: Array<{ date: string; value: number }>) => {
    return data.map(point => ({
      x: new Date(point.date).toLocaleDateString(),
      y: point.value
    }));
  }, []);

  const formatForLineChart = useCallback((data: Array<{ date: string; value: number }>) => {
    return data.map(point => ({
      x: new Date(point.date).getTime(),
      y: point.value
    }));
  }, []);

  const formatForSpaceUtilizationChart = useCallback((
    data: Array<{ date: string; nursery: number; cultivation: number }>
  ) => {
    return {
      nursery: data.map(point => ({ x: point.date, y: point.nursery })),
      cultivation: data.map(point => ({ x: point.date, y: point.cultivation }))
    };
  }, []);

  return {
    formatForBarChart,
    formatForLineChart,
    formatForSpaceUtilizationChart
  };
}
