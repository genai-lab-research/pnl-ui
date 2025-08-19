// Container Metrics Hook - Manages metrics display and real-time updates
import { useState, useEffect, useCallback, useRef } from 'react';
import { ContainerMetricsViewModel } from '../viewmodels';
import { ContainerMetricsDisplay, TimeRangeValue } from '../types';
import { DashboardMetrics } from '../../../api/containerApiService';

/**
 * Hook for container metrics management
 */
export function useContainerMetrics(
  initialMetrics?: DashboardMetrics,
  timeRange: TimeRangeValue = 'week'
) {
  const [refreshKey, setRefreshKey] = useState(0);
  const viewModelRef = useRef<ContainerMetricsViewModel | null>(null);

  // Initialize ViewModel
  useEffect(() => {
    const viewModel = new ContainerMetricsViewModel(initialMetrics);
    viewModelRef.current = viewModel;

    // Subscribe to changes
    const unsubscribe = viewModel.subscribe(() => {
      setRefreshKey(prev => prev + 1);
    });

    // Set initial time range
    viewModel.setTimeRange(timeRange);

    // Cleanup on unmount
    return () => {
      unsubscribe();
      viewModelRef.current = null;
    };
  }, []);

  // Update when metrics change
  useEffect(() => {
    if (initialMetrics && viewModelRef.current) {
      viewModelRef.current.updateMetrics(initialMetrics);
    }
  }, [initialMetrics]);

  // Update when time range changes
  useEffect(() => {
    if (viewModelRef.current) {
      viewModelRef.current.setTimeRange(timeRange);
    }
  }, [timeRange]);

  // Actions
  const updateMetrics = useCallback((metrics: DashboardMetrics) => {
    viewModelRef.current?.updateMetrics(metrics);
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    viewModelRef.current?.setLoading(isLoading);
  }, []);

  const setError = useCallback((error: string | null) => {
    viewModelRef.current?.setError(error);
  }, []);

  // Getters
  const getMetricCards = useCallback(() => {
    return viewModelRef.current?.getMetricCards() || [];
  }, [refreshKey]);

  const getTemperatureCard = useCallback(() => {
    return viewModelRef.current?.getTemperatureCard() || null;
  }, [refreshKey]);

  const getHumidityCard = useCallback(() => {
    return viewModelRef.current?.getHumidityCard() || null;
  }, [refreshKey]);

  const getCO2Card = useCallback(() => {
    return viewModelRef.current?.getCO2Card() || null;
  }, [refreshKey]);

  const getYieldCard = useCallback(() => {
    return viewModelRef.current?.getYieldCard() || null;
  }, [refreshKey]);

  const getYieldChartData = useCallback(() => {
    return viewModelRef.current?.getYieldChartData() || [];
  }, [refreshKey]);

  const getUtilizationChartData = useCallback(() => {
    return viewModelRef.current?.getUtilizationChartData() || [];
  }, [refreshKey]);

  const getUtilizationSummary = useCallback(() => {
    return viewModelRef.current?.getUtilizationSummary() || null;
  }, [refreshKey]);

  const getMetricsStatus = useCallback(() => {
    return viewModelRef.current?.getMetricsStatus() || {
      overall: 'critical' as const,
      issues: ['No metrics data'],
      recommendations: ['Check connectivity'],
    };
  }, [refreshKey]);

  const getTimeRangeOptions = useCallback(() => {
    return viewModelRef.current?.getTimeRangeOptions() || [];
  }, [refreshKey]);

  const isDataStale = useCallback(() => {
    return viewModelRef.current?.isDataStale() || false;
  }, [refreshKey]);

  const isLoadingMetrics = useCallback(() => {
    return viewModelRef.current?.isLoadingMetrics() || false;
  }, [refreshKey]);

  const getError = useCallback(() => {
    return viewModelRef.current?.getError() || null;
  }, [refreshKey]);

  return {
    // Actions
    updateMetrics,
    setLoading,
    setError,
    
    // Individual metric cards
    temperatureCard: getTemperatureCard(),
    humidityCard: getHumidityCard(),
    co2Card: getCO2Card(),
    yieldCard: getYieldCard(),
    
    // All metric cards
    metricCards: getMetricCards(),
    
    // Chart data
    yieldChartData: getYieldChartData(),
    utilizationChartData: getUtilizationChartData(),
    utilizationSummary: getUtilizationSummary(),
    
    // Status and meta
    metricsStatus: getMetricsStatus(),
    timeRangeOptions: getTimeRangeOptions(),
    
    // State
    isDataStale: isDataStale(),
    isLoading: isLoadingMetrics(),
    error: getError(),
    hasData: getMetricCards().length > 0,
    
    // Utility getters
    hasTemperatureData: !!getTemperatureCard(),
    hasHumidityData: !!getHumidityCard(),
    hasCO2Data: !!getCO2Card(),
    hasYieldData: !!getYieldCard(),
    hasChartData: getYieldChartData().length > 0 || getUtilizationChartData().length > 0,
  };
}
