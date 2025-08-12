// Custom hook for Activity Log logic
// Manages activity data, infinite scroll, and filtering

import { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityLogViewModel, ActivityLogState } from '../viewmodels/activity-log.viewmodel';
import { ActivityLogFilter } from '../models/activity-log.model';

export interface UseActivityLogOptions {
  containerId: number;
  initialFilters?: ActivityLogFilter;
  pageSize?: number;
  onError?: (error: string) => void;
}

export interface UseActivityLogResult {
  // State
  state: ActivityLogState;
  
  // Actions
  refreshActivities: () => Promise<void>;
  loadMoreActivities: () => Promise<void>;
  applyFilters: (filters: ActivityLogFilter) => Promise<void>;
  setDateRangeFilter: (startDate?: string, endDate?: string) => Promise<void>;
  setActionTypeFilter: (actionType?: string) => Promise<void>;
  setActorTypeFilter: (actorType?: string) => Promise<void>;
  clearFilters: () => Promise<void>;
  searchActivities: (query: string) => Promise<void>;
  exportActivitiesData: () => Promise<string>;
  
  // Data access
  activities: ReturnType<ActivityLogViewModel['getActivities']>;
  groupedActivities: ReturnType<ActivityLogViewModel['getGroupedActivities']>;
  recentActivities: (limit?: number) => ReturnType<ActivityLogViewModel['getRecentActivities']>;
  activitySummary: ReturnType<ActivityLogViewModel['getActivitySummary']>;
  
  // UI helpers
  formatTimestamp: (timestamp: string) => string;
  getTimelineTime: (timestamp: string) => string;
  getTimelineDate: (timestamp: string) => string;
  getActivityIcon: (actionType: string) => string;
  getActivityColor: (actionType: string) => 'success' | 'info' | 'warning' | 'error' | 'default';
  formatActor: (activity: any) => string;
  isRecentActivity: (timestamp: string) => boolean;
  
  // Filter options
  uniqueActionTypes: string[];
  uniqueActorTypes: string[];
  actionTypeOptions: Array<{ value: string; label: string }>;
  actorTypeOptions: Array<{ value: string; label: string }>;
  
  // State checks
  hasActiveFilters: boolean;
  hasActivities: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export function useActivityLog(options: UseActivityLogOptions): UseActivityLogResult {
  const {
    containerId,
    initialFilters = {},
    pageSize = 20,
    onError
  } = options;

  const viewModelRef = useRef<ActivityLogViewModel | null>(null);
  const [state, setState] = useState<ActivityLogState>({
    activities: [],
    groupedActivities: [],
    isLoading: true,
    isLoadingMore: false,
    hasMore: true,
    error: null,
    filters: initialFilters,
    totalCount: 0
  });

  // Initialize ViewModel
  useEffect(() => {
    const viewModel = new ActivityLogViewModel(containerId);
    viewModelRef.current = viewModel;

    // Set up state change listener
    viewModel.setStateChangeListener((newState) => {
      setState(newState);
    });

    // Set initial filters if provided
    if (Object.keys(initialFilters).length > 0) {
      viewModel.applyFilters(initialFilters).catch((error) => {
        console.error('Failed to apply initial filters:', error);
        if (onError) {
          onError(error.message);
        }
      });
    } else {
      // Initialize data
      viewModel.initialize().catch((error) => {
        console.error('Failed to initialize activity log:', error);
        if (onError) {
          onError(error.message);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      viewModel.destroy();
    };
  }, [containerId]); // FIXED: Only depend on containerId to prevent re-initialization

  // Actions
  const refreshActivities = useCallback(async () => {
    if (viewModelRef.current) {
      await viewModelRef.current.refreshActivities();
    }
  }, []);

  const loadMoreActivities = useCallback(async () => {
    if (viewModelRef.current && !state.isLoadingMore) {
      await viewModelRef.current.loadMoreActivities();
    }
  }, [state.isLoadingMore]);

  const applyFilters = useCallback(async (filters: ActivityLogFilter) => {
    if (viewModelRef.current) {
      await viewModelRef.current.applyFilters(filters);
    }
  }, []);

  const setDateRangeFilter = useCallback(async (startDate?: string, endDate?: string) => {
    if (viewModelRef.current) {
      await viewModelRef.current.setDateRangeFilter(startDate, endDate);
    }
  }, []);

  const setActionTypeFilter = useCallback(async (actionType?: string) => {
    if (viewModelRef.current) {
      await viewModelRef.current.setActionTypeFilter(actionType);
    }
  }, []);

  const setActorTypeFilter = useCallback(async (actorType?: string) => {
    if (viewModelRef.current) {
      await viewModelRef.current.setActorTypeFilter(actorType);
    }
  }, []);

  const clearFilters = useCallback(async () => {
    if (viewModelRef.current) {
      await viewModelRef.current.clearFilters();
    }
  }, []);

  const searchActivities = useCallback(async (query: string) => {
    if (viewModelRef.current) {
      const results = await viewModelRef.current.searchActivities(query);
      // You could handle search results here if needed
    }
  }, []);

  const exportActivitiesData = useCallback(async () => {
    if (viewModelRef.current) {
      return await viewModelRef.current.exportActivitiesData();
    }
    throw new Error('ViewModel not initialized');
  }, []);

  // Data access
  const activities = viewModelRef.current?.getActivities() || [];
  const groupedActivities = viewModelRef.current?.getGroupedActivities() || [];
  const recentActivities = useCallback((limit = 10) => {
    return viewModelRef.current?.getRecentActivities(limit) || [];
  }, []);
  const activitySummary = viewModelRef.current?.getActivitySummary() || {
    totalActivities: 0,
    recentActivities: 0,
    mostCommonAction: null,
    actionTypeCounts: {}
  };

  // UI helpers
  const formatTimestamp = useCallback((timestamp: string) => {
    return viewModelRef.current?.formatTimestamp(timestamp) || '';
  }, []);

  const getTimelineTime = useCallback((timestamp: string) => {
    return viewModelRef.current?.getTimelineTime(timestamp) || '';
  }, []);

  const getTimelineDate = useCallback((timestamp: string) => {
    return viewModelRef.current?.getTimelineDate(timestamp) || '';
  }, []);

  const getActivityIcon = useCallback((actionType: string) => {
    return viewModelRef.current?.getActivityIcon(actionType) || 'activity';
  }, []);

  const getActivityColor = useCallback((actionType: string) => {
    return viewModelRef.current?.getActivityColor(actionType) || 'default';
  }, []);

  const formatActor = useCallback((activity: any) => {
    return viewModelRef.current?.formatActor(activity) || '';
  }, []);

  const isRecentActivity = useCallback((timestamp: string) => {
    return viewModelRef.current?.isRecentActivity(timestamp) || false;
  }, []);

  // Filter options
  const uniqueActionTypes = viewModelRef.current?.getUniqueActionTypes() || [];
  const uniqueActorTypes = viewModelRef.current?.getUniqueActorTypes() || [];
  const actionTypeOptions = viewModelRef.current?.getActionTypeOptions() || [];
  const actorTypeOptions = viewModelRef.current?.getActorTypeOptions() || [];

  // State checks
  const hasActiveFilters = viewModelRef.current?.hasActiveFilters() || false;
  const hasActivities = viewModelRef.current?.hasActivities() || false;
  const isLoading = viewModelRef.current?.isLoading() || false;
  const isLoadingMore = state.isLoadingMore;
  const hasMore = viewModelRef.current?.hasMore() || false;
  const hasError = viewModelRef.current?.hasError() || false;
  const errorMessage = viewModelRef.current?.getErrorMessage() || null;

  return {
    // State
    state,
    
    // Actions
    refreshActivities,
    loadMoreActivities,
    applyFilters,
    setDateRangeFilter,
    setActionTypeFilter,
    setActorTypeFilter,
    clearFilters,
    searchActivities,
    exportActivitiesData,
    
    // Data access
    activities,
    groupedActivities,
    recentActivities,
    activitySummary,
    
    // UI helpers
    formatTimestamp,
    getTimelineTime,
    getTimelineDate,
    getActivityIcon,
    getActivityColor,
    formatActor,
    isRecentActivity,
    
    // Filter options
    uniqueActionTypes,
    uniqueActorTypes,
    actionTypeOptions,
    actorTypeOptions,
    
    // State checks
    hasActiveFilters,
    hasActivities,
    isLoading,
    isLoadingMore,
    hasMore,
    hasError,
    errorMessage
  };
}

// Hook for activity filters UI
export function useActivityFilters(
  actionTypeOptions: Array<{ value: string; label: string }>,
  actorTypeOptions: Array<{ value: string; label: string }>,
  onFilterChange: (filters: ActivityLogFilter) => Promise<void>
) {
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  const [selectedActionType, setSelectedActionType] = useState('');
  const [selectedActorType, setSelectedActorType] = useState('');

  const applyFilters = useCallback(async () => {
    await onFilterChange({
      start_date: dateRange.start,
      end_date: dateRange.end,
      action_type: selectedActionType || undefined,
      actor_type: selectedActorType || undefined
    });
  }, [dateRange, selectedActionType, selectedActorType, onFilterChange]);

  const clearAllFilters = useCallback(async () => {
    setDateRange({});
    setSelectedActionType('');
    setSelectedActorType('');
    await onFilterChange({});
  }, [onFilterChange]);

  const setDateRangeFilter = useCallback((start?: string, end?: string) => {
    setDateRange({ start, end });
  }, []);

  const hasActiveFilters = Boolean(
    dateRange.start || 
    dateRange.end || 
    selectedActionType || 
    selectedActorType
  );

  return {
    dateRange,
    setDateRangeFilter,
    selectedActionType,
    setSelectedActionType,
    selectedActorType,
    setSelectedActorType,
    applyFilters,
    clearAllFilters,
    hasActiveFilters
  };
}

// Hook for activity search
export function useActivitySearch(
  onSearchResult?: (activities: any[]) => void
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (
    searchFunction: (query: string) => Promise<any[]>,
    query: string
  ) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchFunction(query);
      setSearchResults(results);
      if (onSearchResult) {
        onSearchResult(results);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [onSearchResult]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    performSearch,
    clearSearch
  };
}
