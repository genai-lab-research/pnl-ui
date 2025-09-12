// Main Container Detail Hook - Orchestrates overall page state and lifecycle
import { useState, useEffect, useCallback, useRef } from 'react';
import { ContainerDetailViewModel } from '../viewmodels';
import { ContainerDetailState, TimeRangeValue } from '../types';

/**
 * Main hook for Container Detail page
 * Manages overall state, initialization, and cleanup
 */
export function useContainerDetail(containerId: number) {
  const [state, setState] = useState<ContainerDetailState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const viewModelRef = useRef<ContainerDetailViewModel | null>(null);

  // Initialize ViewModel
  useEffect(() => {
    const viewModel = new ContainerDetailViewModel(containerId);
    viewModelRef.current = viewModel;

    // Subscribe to state changes
    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });

    // Initialize the container detail view
    viewModel.initialize().finally(() => {
      setIsInitialized(true);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      viewModel.dispose();
      viewModelRef.current = null;
    };
  }, [containerId]);

  // Actions
  const setActiveTab = useCallback((tab: string) => {
    viewModelRef.current?.setActiveTab(tab);
  }, []);

  const setTimeRange = useCallback(async (timeRange: TimeRangeValue) => {
    await viewModelRef.current?.setTimeRange(timeRange);
  }, []);

  const refresh = useCallback(async () => {
    await viewModelRef.current?.refresh();
  }, []);

  const clearError = useCallback(() => {
    viewModelRef.current?.clearError();
  }, []);

  const retry = useCallback(async () => {
    await viewModelRef.current?.retry();
  }, []);

  // Derived data getters
  const getContainerInfo = useCallback(() => {
    return viewModelRef.current?.getContainerInfo() || null;
  }, [state]);

  const getMetricsDisplay = useCallback(() => {
    return viewModelRef.current?.getMetricsDisplay() || null;
  }, [state]);

  const getMetricCards = useCallback(() => {
    return viewModelRef.current?.getMetricCards() || [];
  }, [state]);

  const getNavigationModel = useCallback(() => {
    return viewModelRef.current?.getNavigationModel() || null;
  }, [state]);

  const getHeaderModel = useCallback(() => {
    return viewModelRef.current?.getHeaderModel() || null;
  }, [state]);

  const getTabNavigationModel = useCallback(() => {
    return viewModelRef.current?.getTabNavigationModel() || null;
  }, [state]);

  const getTimeRangeSelectorModel = useCallback(() => {
    return viewModelRef.current?.getTimeRangeSelectorModel() || null;
  }, [state]);

  const getLoadingState = useCallback(() => {
    return viewModelRef.current?.getLoadingState() || { isLoading: true };
  }, [state]);

  const getErrorState = useCallback(() => {
    return viewModelRef.current?.getErrorState() || { isError: false, errorMessage: '', onRetry: undefined };
  }, [state]);

  const getDataFreshness = useCallback(() => {
    return viewModelRef.current?.getDataFreshness() || {
      lastUpdated: '',
      isStale: true,
      needsRefresh: true,
    };
  }, [state]);

  const shouldShowRealTimeIndicator = useCallback(() => {
    return viewModelRef.current?.shouldShowRealTimeIndicator() || false;
  }, [state]);

  return {
    // State
    state,
    isInitialized,
    
    // Actions
    setActiveTab,
    setTimeRange,
    refresh,
    clearError,
    retry,
    
    // Derived data
    containerInfo: getContainerInfo(),
    metricsDisplay: getMetricsDisplay(),
    metricCards: getMetricCards(),
    navigationModel: getNavigationModel(),
    headerModel: getHeaderModel(),
    tabNavigationModel: getTabNavigationModel(),
    timeRangeSelectorModel: getTimeRangeSelectorModel(),
    loadingState: getLoadingState(),
    errorState: getErrorState(),
    dataFreshness: getDataFreshness(),
    showRealTimeIndicator: shouldShowRealTimeIndicator(),
    
    // Utility
    isLoading: !isInitialized || getLoadingState().isLoading,
    isError: getErrorState().isError,
    hasData: !!state?.data,
    canRetry: !!getErrorState().onRetry,
  };
}
