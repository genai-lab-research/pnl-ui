// Container Activity Hook - Manages activity logs and timeline
import { useState, useEffect, useCallback, useRef } from 'react';
import { ContainerActivityViewModel } from '../viewmodels';
import { ActivityFilters } from '../types';
import { ActivityLog } from '../../../types/containers';

/**
 * Hook for container activity logs management
 */
export function useContainerActivity(
  containerId: number,
  initialActivities: ActivityLog[] = []
) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const viewModelRef = useRef<ContainerActivityViewModel | null>(null);

  // Initialize ViewModel
  useEffect(() => {
    const viewModel = new ContainerActivityViewModel(containerId, initialActivities);
    viewModelRef.current = viewModel;

    // Subscribe to changes
    const unsubscribe = viewModel.subscribe(() => {
      setRefreshKey(prev => prev + 1);
    });

    // Load initial activities if none provided
    if (initialActivities.length === 0) {
      viewModel.loadActivities().finally(() => {
        setIsInitialized(true);
      });
    } else {
      setIsInitialized(true);
    }

    // Cleanup on unmount
    return () => {
      unsubscribe();
      viewModelRef.current = null;
    };
  }, [containerId]);

  // Actions
  const loadActivities = useCallback(async () => {
    await viewModelRef.current?.loadActivities();
  }, []);

  const loadMoreActivities = useCallback(async () => {
    await viewModelRef.current?.loadMoreActivities();
  }, []);

  const setFilters = useCallback(async (filters: Partial<ActivityFilters>) => {
    await viewModelRef.current?.setFilters(filters);
  }, []);

  const clearFilters = useCallback(async () => {
    await viewModelRef.current?.clearFilters();
  }, []);

  const goToPage = useCallback(async (page: number) => {
    await viewModelRef.current?.goToPage(page);
  }, []);

  const setPageSize = useCallback(async (limit: number) => {
    await viewModelRef.current?.setPageSize(limit);
  }, []);

  const refresh = useCallback(async () => {
    await viewModelRef.current?.refresh();
  }, []);

  const addActivity = useCallback((activity: ActivityLog) => {
    viewModelRef.current?.addActivity(activity);
  }, []);

  // Getters
  const getActivityItems = useCallback(() => {
    return viewModelRef.current?.getActivityItems() || [];
  }, [refreshKey]);

  const getGroupedActivities = useCallback(() => {
    return viewModelRef.current?.getGroupedActivities() || [];
  }, [refreshKey]);

  const getRecentActivities = useCallback(() => {
    return viewModelRef.current?.getRecentActivities() || [];
  }, [refreshKey]);

  const getActivitySummary = useCallback(() => {
    return viewModelRef.current?.getActivitySummary() || [];
  }, [refreshKey]);

  const getFilterOptions = useCallback(() => {
    return viewModelRef.current?.getFilterOptions() || {
      actionTypes: [],
      actorTypes: [],
      dateRanges: [],
    };
  }, [refreshKey]);

  const getCurrentFilters = useCallback(() => {
    return viewModelRef.current?.getCurrentFilters() || {};
  }, [refreshKey]);

  const getPaginationModel = useCallback(() => {
    return viewModelRef.current?.getPaginationModel() || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20,
      onPageChange: () => {},
      onItemsPerPageChange: () => {},
    };
  }, [refreshKey]);

  const hasMoreActivities = useCallback(() => {
    return viewModelRef.current?.hasMoreActivities() || false;
  }, [refreshKey]);

  const isLoading = useCallback(() => {
    return viewModelRef.current?.isLoading() || false;
  }, [refreshKey]);

  const getError = useCallback(() => {
    return viewModelRef.current?.getError() || null;
  }, [refreshKey]);

  const hasActiveFilters = useCallback(() => {
    return viewModelRef.current?.hasActiveFilters() || false;
  }, [refreshKey]);

  const getActivityStats = useCallback(() => {
    return viewModelRef.current?.getActivityStats() || {
      total: 0,
      today: 0,
      thisWeek: 0,
      averagePerDay: 0,
    };
  }, [refreshKey]);

  // Convenience filters
  const filterByActionType = useCallback(async (actionType: string) => {
    await setFilters({ actionType });
  }, [setFilters]);

  const filterByActorType = useCallback(async (actorType: string) => {
    await setFilters({ actorType });
  }, [setFilters]);

  const filterByDateRange = useCallback(async (startDate: string, endDate?: string) => {
    await setFilters({ startDate, endDate });
  }, [setFilters]);

  const filterLastDay = useCallback(async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    await filterByDateRange(startDate.toISOString());
  }, [filterByDateRange]);

  const filterLastWeek = useCallback(async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    await filterByDateRange(startDate.toISOString());
  }, [filterByDateRange]);

  const filterLastMonth = useCallback(async () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    await filterByDateRange(startDate.toISOString());
  }, [filterByDateRange]);

  return {
    // State
    isInitialized,
    
    // Actions
    loadActivities,
    loadMoreActivities,
    setFilters,
    clearFilters,
    goToPage,
    setPageSize,
    refresh,
    addActivity,
    
    // Filter convenience methods
    filterByActionType,
    filterByActorType,
    filterByDateRange,
    filterLastDay,
    filterLastWeek,
    filterLastMonth,
    
    // Data
    activityItems: getActivityItems(),
    groupedActivities: getGroupedActivities(),
    recentActivities: getRecentActivities(),
    activitySummary: getActivitySummary(),
    activityStats: getActivityStats(),
    
    // Filter data
    filterOptions: getFilterOptions(),
    currentFilters: getCurrentFilters(),
    hasActiveFilters: hasActiveFilters(),
    
    // Pagination
    paginationModel: getPaginationModel(),
    hasMoreActivities: hasMoreActivities(),
    
    // State
    isLoading: isLoading(),
    error: getError(),
    hasData: getActivityItems().length > 0,
    hasRecentData: getRecentActivities().length > 0,
    
    // Utility
    canLoadMore: hasMoreActivities() && !isLoading(),
    showLoadMore: hasMoreActivities(),
    showPagination: getPaginationModel().totalPages > 1,
    showFilters: getFilterOptions().actionTypes.length > 0,
  };
}
