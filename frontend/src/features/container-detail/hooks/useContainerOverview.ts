// Hook for Container Overview functionality
import { useState, useEffect, useRef, useCallback } from 'react';
import { ContainerOverviewViewModel, ContainerOverviewState } from '../viewmodels/ContainerOverview.viewmodel';
import { TimeRange } from '../types';

export interface UseContainerOverviewResult {
  // State
  state: ContainerOverviewState;
  
  // Container info
  containerInfo: ReturnType<ContainerOverviewViewModel['getContainerInfo']>;
  
  // Component props
  navigationProps: ReturnType<ContainerOverviewViewModel['getNavigationProps']>;
  statusHeaderProps: ReturnType<ContainerOverviewViewModel['getStatusHeaderProps']>;
  metricCards: ReturnType<ContainerOverviewViewModel['getMetricCards']>;
  cropsTableData: ReturnType<ContainerOverviewViewModel['getCropsTableData']>;
  activityTimeline: ReturnType<ContainerOverviewViewModel['getActivityTimeline']>;
  timeSelectorProps: ReturnType<ContainerOverviewViewModel['getTimeSelectorProps']>;
  
  // Actions
  loadOverviewData: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  loadMoreActivities: () => Promise<void>;
  changeTimeRange: (timeRange: TimeRange) => Promise<void>;
  clearError: (errorType: keyof ContainerOverviewState['errors']) => void;
  changeCropsPage: (page: number) => void;
  changeCropsItemsPerPage: (itemsPerPage: number) => void;
  
  // State checks
  hasMoreActivities: boolean;
  isLoading: ContainerOverviewState['isLoading'];
  errors: ContainerOverviewState['errors'];
}

/**
 * Custom hook for Container Overview tab functionality
 * Integrates ContainerOverviewViewModel with React component lifecycle
 */
export const useContainerOverview = (containerId: number): UseContainerOverviewResult => {
  const viewModelRef = useRef<ContainerOverviewViewModel | null>(null);
  const [state, setState] = useState<ContainerOverviewState>({
    overview: null,
    isLoading: {
      overview: false,
      metrics: false,
      activities: false,
      settings: false,
    },
    errors: {},
    timeRange: 'week',
    activityPage: 1,
    activityLimit: 20,
    cropsPage: 1,
    cropsLimit: 2,
  });

  // Initialize ViewModel
  useEffect(() => {
    const viewModel = new ContainerOverviewViewModel(containerId);
    viewModelRef.current = viewModel;

    // Subscribe to state changes
    const unsubscribe = viewModel.subscribe((newState: ContainerOverviewState) => {
      setState(newState);
    });

    // Initialize state
    setState(viewModel.getState());

    // Load initial data
    viewModel.loadOverviewData();

    // Start metrics polling
    viewModel.startMetricsPolling();

    return () => {
      unsubscribe();
      viewModel.dispose();
      viewModelRef.current = null;
    };
  }, [containerId]);

  // Memoized action handlers
  const loadOverviewData = useCallback(async () => {
    if (viewModelRef.current) {
      await viewModelRef.current.loadOverviewData();
    }
  }, []);

  const refreshMetrics = useCallback(async () => {
    if (viewModelRef.current) {
      await viewModelRef.current.refreshMetrics();
    }
  }, []);

  const loadMoreActivities = useCallback(async () => {
    if (viewModelRef.current) {
      await viewModelRef.current.loadMoreActivities();
    }
  }, []);

  const changeTimeRange = useCallback(async (timeRange: TimeRange) => {
    if (viewModelRef.current) {
      await viewModelRef.current.changeTimeRange(timeRange);
    }
  }, []);

  const clearError = useCallback((errorType: keyof ContainerOverviewState['errors']) => {
    if (viewModelRef.current) {
      viewModelRef.current.clearError(errorType);
    }
  }, []);

  const changeCropsPage = useCallback((page: number) => {
    if (viewModelRef.current) {
      viewModelRef.current.changeCropsPage(page);
    }
  }, []);

  const changeCropsItemsPerPage = useCallback((itemsPerPage: number) => {
    if (viewModelRef.current) {
      viewModelRef.current.changeCropsItemsPerPage(itemsPerPage);
    }
  }, []);

  // Memoized derived data
  const containerInfo = viewModelRef.current?.getContainerInfo() ?? null;
  const navigationProps = viewModelRef.current?.getNavigationProps() ?? {
    containerName: `Container ${containerId}`,
    onBreadcrumbClick: () => window.history.back(),
  };
  const statusHeaderProps = viewModelRef.current?.getStatusHeaderProps() ?? null;
  const metricCards = viewModelRef.current?.getMetricCards() ?? [];
  const cropsTableData = viewModelRef.current?.getCropsTableData() ?? { rows: [], seedTypes: '', pagination: { page: 1, totalPages: 1, total: 0, limit: 2 } };
  const activityTimeline = viewModelRef.current?.getActivityTimeline() ?? [];
  const timeSelectorProps = viewModelRef.current?.getTimeSelectorProps() ?? {
    selectedRange: 'week' as TimeRange,
    onRangeChange: changeTimeRange,
  };
  const hasMoreActivities = viewModelRef.current?.hasMoreActivities() ?? false;

  return {
    // State
    state,
    
    // Container info
    containerInfo,
    
    // Component props
    navigationProps,
    statusHeaderProps,
    metricCards,
    cropsTableData,
    activityTimeline,
    timeSelectorProps,
    
    // Actions
    loadOverviewData,
    refreshMetrics,
    loadMoreActivities,
    changeTimeRange,
    clearError,
    changeCropsPage,
    changeCropsItemsPerPage,
    
    // State checks
    hasMoreActivities,
    isLoading: state.isLoading,
    errors: state.errors,
  };
};