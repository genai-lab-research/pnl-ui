// Custom hook for Crop Summary logic
// Manages crop data, filtering, sorting, and table interactions

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { CropSummaryViewModel, CropSummaryState } from '../viewmodels/crop-summary.viewmodel';
import { CropSortConfig, CropFilterConfig } from '../models/crop-summary.model';

export interface UseCropSummaryOptions {
  containerId: number;
  initialSort?: CropSortConfig;
  initialFilter?: CropFilterConfig;
  onError?: (error: string) => void;
}

export interface UseCropSummaryResult {
  // State
  state: CropSummaryState;
  
  // Actions
  refreshData: () => Promise<void>;
  setSortConfig: (sortConfig: CropSortConfig) => void;
  toggleSort: (field: CropSortConfig['field']) => void;
  setFilterConfig: (filterConfig: CropFilterConfig) => void;
  setSeedTypeFilter: (seedType: string) => void;
  setOverdueFilter: (overdueOnly: boolean) => void;
  setAgeRangeFilter: (minAge?: number, maxAge?: number) => void;
  clearFilters: () => void;
  exportCropsData: () => Promise<string>;
  searchCrops: (query: string) => void;
  
  // Data access
  filteredCrops: ReturnType<CropSummaryViewModel['getFilteredCrops']>;
  allCrops: ReturnType<CropSummaryViewModel['getAllCrops']>;
  stats: ReturnType<CropSummaryViewModel['getStats']>;
  filteredStats: ReturnType<CropSummaryViewModel['getFilteredStats']>;
  uniqueSeedTypes: string[];
  cropsNeedingIntervention: ReturnType<CropSummaryViewModel['getCropsNeedingIntervention']>;
  cropsByStatus: ReturnType<CropSummaryViewModel['getCropsByStatus']>;
  
  // UI helpers
  tableColumns: ReturnType<CropSummaryViewModel['getTableColumns']>;
  getSortIcon: (field: CropSortConfig['field']) => 'asc' | 'desc' | 'none';
  formatCropRow: (crop: any) => any;
  getCropStatus: (crop: any) => 'healthy' | 'warning' | 'overdue';
  getCropStatusColor: (crop: any) => 'success' | 'warning' | 'error';
  formatDate: (dateString: string | null) => string;
  needsIntervention: (crop: any) => boolean;
  getInterventionMessage: (crop: any) => string | null;
  
  // State checks
  hasActiveFilters: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export function useCropSummary(options: UseCropSummaryOptions): UseCropSummaryResult {
  const {
    containerId,
    initialSort = { field: 'seed_type', direction: 'asc' },
    initialFilter = {},
    onError
  } = options;

  const viewModelRef = useRef<CropSummaryViewModel | null>(null);
  const [state, setState] = useState<CropSummaryState>({
    crops: [],
    filteredCrops: [],
    stats: { totalCrops: 0, totalNurseryStations: 0, totalCultivationAreas: 0, totalOverdue: 0, averageAge: 0 },
    sortConfig: initialSort,
    filterConfig: initialFilter,
    isLoading: true,
    error: null
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Initialize ViewModel
  useEffect(() => {
    const viewModel = new CropSummaryViewModel(containerId);
    viewModelRef.current = viewModel;

    // Set up state change listener
    viewModel.setStateChangeListener((newState) => {
      setState(newState);
    });

    // Set initial sort and filter
    if (initialSort) {
      viewModel.setSortConfig(initialSort);
    }
    if (initialFilter && Object.keys(initialFilter).length > 0) {
      viewModel.setFilterConfig(initialFilter);
    }

    // Initialize data
    viewModel.initialize().catch((error) => {
      console.error('Failed to initialize crop summary:', error);
      if (onError) {
        onError(error.message);
      }
    });

    // Cleanup on unmount
    return () => {
      viewModel.destroy();
    };
  }, [containerId]); // FIXED: Only depend on containerId to prevent re-initialization

  // Actions
  const refreshData = useCallback(async () => {
    if (viewModelRef.current) {
      await viewModelRef.current.refreshData();
    }
  }, []);

  const setSortConfig = useCallback((sortConfig: CropSortConfig) => {
    if (viewModelRef.current) {
      viewModelRef.current.setSortConfig(sortConfig);
    }
  }, []);

  const toggleSort = useCallback((field: CropSortConfig['field']) => {
    if (viewModelRef.current) {
      viewModelRef.current.toggleSort(field);
    }
  }, []);

  const setFilterConfig = useCallback((filterConfig: CropFilterConfig) => {
    if (viewModelRef.current) {
      viewModelRef.current.setFilterConfig(filterConfig);
    }
  }, []);

  const setSeedTypeFilter = useCallback((seedType: string) => {
    if (viewModelRef.current) {
      viewModelRef.current.setSeedTypeFilter(seedType);
    }
  }, []);

  const setOverdueFilter = useCallback((overdueOnly: boolean) => {
    if (viewModelRef.current) {
      viewModelRef.current.setOverdueFilter(overdueOnly);
    }
  }, []);

  const setAgeRangeFilter = useCallback((minAge?: number, maxAge?: number) => {
    if (viewModelRef.current) {
      viewModelRef.current.setAgeRangeFilter(minAge, maxAge);
    }
  }, []);

  const clearFilters = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.clearFilters();
    }
    setSearchQuery('');
  }, []);

  const exportCropsData = useCallback(async () => {
    if (viewModelRef.current) {
      return await viewModelRef.current.exportCropsData();
    }
    throw new Error('ViewModel not initialized');
  }, []);

  const searchCrops = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Data access with search filtering
  const filteredCrops = useMemo(() => {
    if (!viewModelRef.current) return [];
    
    const crops = viewModelRef.current.getFilteredCrops();
    
    if (!searchQuery.trim()) {
      return crops;
    }
    
    return viewModelRef.current.searchCrops(searchQuery);
  }, [searchQuery, state.filteredCrops]);

  const allCrops = viewModelRef.current?.getAllCrops() || [];
  const stats = viewModelRef.current?.getStats() || state.stats;
  const filteredStats = viewModelRef.current?.getFilteredStats() || state.stats;
  const uniqueSeedTypes = viewModelRef.current?.getUniqueSeedTypes() || [];
  const cropsNeedingIntervention = viewModelRef.current?.getCropsNeedingIntervention() || [];
  const cropsByStatus = viewModelRef.current?.getCropsByStatus() || { healthy: [], warning: [], overdue: [] };

  // UI helpers
  const tableColumns = viewModelRef.current?.getTableColumns() || [];
  const getSortIcon = useCallback((field: CropSortConfig['field']) => {
    return viewModelRef.current?.getSortIcon(field) || 'none';
  }, [state.sortConfig]);

  const formatCropRow = useCallback((crop: any) => {
    return viewModelRef.current?.getFormattedCropRow(crop) || {};
  }, []);

  const getCropStatus = useCallback((crop: any) => {
    return viewModelRef.current?.getCropStatus(crop) || 'healthy';
  }, []);

  const getCropStatusColor = useCallback((crop: any) => {
    return viewModelRef.current?.getCropStatusColor(crop) || 'success';
  }, []);

  const formatDate = useCallback((dateString: string | null) => {
    return viewModelRef.current?.formatDate(dateString) || 'Never';
  }, []);

  const needsIntervention = useCallback((crop: any) => {
    return viewModelRef.current?.needsIntervention(crop) || false;
  }, []);

  const getInterventionMessage = useCallback((crop: any) => {
    return viewModelRef.current?.getInterventionMessage(crop) || null;
  }, []);

  // State checks
  const hasActiveFilters = viewModelRef.current?.hasActiveFilters() || Boolean(searchQuery.trim());
  const isLoading = state.isLoading;
  const hasError = Boolean(state.error);
  const errorMessage = state.error;

  return {
    // State
    state,
    
    // Actions
    refreshData,
    setSortConfig,
    toggleSort,
    setFilterConfig,
    setSeedTypeFilter,
    setOverdueFilter,
    setAgeRangeFilter,
    clearFilters,
    exportCropsData,
    searchCrops,
    
    // Data access
    filteredCrops,
    allCrops,
    stats,
    filteredStats,
    uniqueSeedTypes,
    cropsNeedingIntervention,
    cropsByStatus,
    
    // UI helpers
    tableColumns,
    getSortIcon,
    formatCropRow,
    getCropStatus,
    getCropStatusColor,
    formatDate,
    needsIntervention,
    getInterventionMessage,
    
    // State checks
    hasActiveFilters,
    isLoading,
    hasError,
    errorMessage
  };
}

// Hook for crop filtering UI
export function useCropFilters(
  uniqueSeedTypes: string[],
  onFilterChange: (filters: CropFilterConfig) => void
) {
  const [seedTypeFilter, setSeedTypeFilter] = useState('');
  const [overdueFilter, setOverdueFilter] = useState(false);
  const [ageRange, setAgeRange] = useState<{ min?: number; max?: number }>({});

  const applyFilters = useCallback(() => {
    onFilterChange({
      seedTypeFilter: seedTypeFilter || undefined,
      overdueOnly: overdueFilter,
      minAge: ageRange.min,
      maxAge: ageRange.max
    });
  }, [seedTypeFilter, overdueFilter, ageRange, onFilterChange]);

  const clearAllFilters = useCallback(() => {
    setSeedTypeFilter('');
    setOverdueFilter(false);
    setAgeRange({});
    onFilterChange({});
  }, [onFilterChange]);

  const seedTypeOptions = useMemo(() => [
    { value: '', label: 'All Seed Types' },
    ...uniqueSeedTypes.map(type => ({ value: type, label: type }))
  ], [uniqueSeedTypes]);

  return {
    seedTypeFilter,
    setSeedTypeFilter,
    overdueFilter,
    setOverdueFilter,
    ageRange,
    setAgeRange,
    applyFilters,
    clearAllFilters,
    seedTypeOptions
  };
}

// Hook for crop table sorting
export function useCropTableSort(
  initialSort: CropSortConfig,
  onSortChange: (sort: CropSortConfig) => void
) {
  const [sortConfig, setSortConfig] = useState(initialSort);

  const handleSort = useCallback((field: CropSortConfig['field']) => {
    const newDirection: 'asc' | 'desc' = sortConfig.field === field && sortConfig.direction === 'asc' 
      ? 'desc' 
      : 'asc';
    
    const newSort: CropSortConfig = { field, direction: newDirection };
    setSortConfig(newSort);
    onSortChange(newSort);
  }, [sortConfig, onSortChange]);

  const getSortIcon = useCallback((field: CropSortConfig['field']) => {
    if (sortConfig.field !== field) return 'none';
    return sortConfig.direction;
  }, [sortConfig]);

  return {
    sortConfig,
    handleSort,
    getSortIcon
  };
}
