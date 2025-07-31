// Main Dashboard Hook
// Provides complete dashboard state and actions

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardViewModel } from '../viewmodels';
import { TimeRangeType } from '../models';

export interface UseDashboardReturn {
  // State
  isInitialized: boolean;
  isLoading: boolean;
  isSearchLoading: boolean;
  isFilterLoading: boolean;
  isTimeRangeLoading: boolean;
  hasErrors: boolean;
  canRefresh: boolean;
  lastRefresh: Date | null;
  
  // Data
  containers: DashboardViewModel['containers'];
  performance: DashboardViewModel['performance'];
  filters: DashboardViewModel['filters'];
  pagination: DashboardViewModel['pagination'];
  summaryStats: ReturnType<DashboardViewModel['getSummaryStats']>;
  statusSummary: ReturnType<DashboardViewModel['getStatusSummary']>;
  
  // View state
  selectedContainerId: number | null;
  showCreateModal: boolean;
  showEditModal: boolean;
  editingContainer: ReturnType<DashboardViewModel['getSelectedContainer']>;
  
  // Actions
  initialize: () => Promise<void>;
  refreshAll: () => Promise<void>;
  refreshContainers: () => Promise<void>;
  refreshPerformance: () => Promise<void>;
  
  // Filter and search
  updateSearch: (query: string) => Promise<void>;
  applyFilters: (filters: any) => Promise<void>;
  clearFilters: () => Promise<void>;
  
  // Pagination
  changePage: (page: number) => Promise<void>;
  changePageSize: (size: number) => Promise<void>;
  
  // Time range and type selection
  changeTimeRange: (range: TimeRangeType) => Promise<void>;
  selectContainerType: (type: 'all' | 'physical' | 'virtual') => Promise<void>;
  
  // Container management
  createContainer: (data: any) => Promise<{ success: boolean; error?: string }>;
  updateContainer: (id: number, data: any) => Promise<{ success: boolean; error?: string }>;
  deleteContainer: (id: number) => Promise<{ success: boolean; error?: string }>;
  shutdownContainer: (id: number, reason?: string) => Promise<{ success: boolean; error?: string }>;
  
  // Modal management
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (container: any) => void;
  closeEditModal: () => void;
  
  // Selection
  selectContainer: (id: number) => void;
  clearSelection: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const navigate = useNavigate();
  const viewModelRef = useRef<DashboardViewModel | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  
  // Initialize ViewModel on first render
  if (!viewModelRef.current) {
    viewModelRef.current = new DashboardViewModel();
  }
  
  const viewModel = viewModelRef.current;
  
  // Force re-render when state changes
  const triggerUpdate = useCallback(() => {
    setUpdateCount(prev => prev + 1);
  }, []); // Empty dependency array as this function never needs to change
  
  // Initialize dashboard on mount
  useEffect(() => {
    if (!viewModel.isInitialized) {
      viewModel.initialize().then(triggerUpdate);
    }
    
    // Cleanup on unmount
    return () => {
      viewModel.dispose();
    };
  }, []); // Empty dependency array since viewModel is from ref and triggerUpdate shouldn't change
  
  // Memoized action handlers
  const initialize = useCallback(async () => {
    await viewModel.initialize();
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const refreshAll = useCallback(async () => {
    await viewModel.refreshAll();
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const refreshContainers = useCallback(async () => {
    await viewModel.refreshContainers();
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const refreshPerformance = useCallback(async () => {
    await viewModel.refreshPerformance();
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const updateSearch = useCallback(async (query: string) => {
    await viewModel.updateSearch(query);
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const applyFilters = useCallback(async (filters: any) => {
    await viewModel.applyFilters(filters);
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const clearFilters = useCallback(async () => {
    await viewModel.clearFilters();
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const changePage = useCallback(async (page: number) => {
    await viewModel.changePage(page);
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const changePageSize = useCallback(async (size: number) => {
    await viewModel.changePageSize(size);
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const changeTimeRange = useCallback(async (range: TimeRangeType) => {
    await viewModel.changeTimeRange(range);
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const selectContainerType = useCallback(async (type: 'all' | 'physical' | 'virtual') => {
    await viewModel.selectContainerType(type);
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const createContainer = useCallback(async (data: any) => {
    const result = await viewModel.createContainer(data);
    triggerUpdate();
    return result;
  }, [viewModel, triggerUpdate]);
  
  const updateContainer = useCallback(async (id: number, data: any) => {
    const result = await viewModel.updateContainer(id, data);
    triggerUpdate();
    return result;
  }, [viewModel, triggerUpdate]);
  
  const deleteContainer = useCallback(async (id: number) => {
    const result = await viewModel.deleteContainer(id);
    triggerUpdate();
    return result;
  }, [viewModel, triggerUpdate]);
  
  const shutdownContainer = useCallback(async (id: number, reason?: string) => {
    const result = await viewModel.shutdownContainer(id, reason);
    triggerUpdate();
    return result;
  }, [viewModel, triggerUpdate]);
  
  const openCreateModal = useCallback(() => {
    viewModel.showCreateModal();
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const closeCreateModal = useCallback(() => {
    viewModel.hideCreateModal();
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const openEditModal = useCallback((container: any) => {
    viewModel.showEditModal(container);
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const closeEditModal = useCallback(() => {
    viewModel.hideEditModal();
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const selectContainer = useCallback((id: number) => {
    viewModel.selectContainer(id);
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  const clearSelection = useCallback(() => {
    viewModel.clearSelection();
    triggerUpdate();
  }, [viewModel, triggerUpdate]);
  
  return {
    // State
    isInitialized: viewModel.isInitialized,
    isLoading: viewModel.isLoading,
    isSearchLoading: viewModel.state.loading.containers,
    isFilterLoading: viewModel.state.loading.containers,
    isTimeRangeLoading: viewModel.state.loading.performance,
    hasErrors: viewModel.hasErrors,
    canRefresh: viewModel.canRefresh,
    lastRefresh: viewModel.viewData.lastRefresh,
    
    // Data
    containers: viewModel.containers,
    performance: viewModel.performance,
    filters: viewModel.filters,
    pagination: viewModel.pagination,
    summaryStats: viewModel.getSummaryStats(),
    statusSummary: viewModel.getStatusSummary(),
    
    // View state
    selectedContainerId: viewModel.viewData.selectedContainerId,
    showCreateModal: viewModel.viewData.showCreateModal,
    showEditModal: viewModel.viewData.showEditModal,
    editingContainer: viewModel.getSelectedContainer(),
    
    // Actions
    initialize,
    refreshAll,
    refreshContainers,
    refreshPerformance,
    
    // Filter and search
    updateSearch,
    applyFilters,
    clearFilters,
    
    // Pagination
    changePage,
    changePageSize,
    
    // Time range and type selection
    changeTimeRange,
    selectContainerType,
    
    // Container management
    createContainer,
    updateContainer,
    deleteContainer,
    shutdownContainer,
    
    // Modal management
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    
    // Selection
    selectContainer,
    clearSelection
  };
}
