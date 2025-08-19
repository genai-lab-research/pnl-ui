import { useState, useCallback, useEffect, useMemo } from 'react';
import type { ContainerFilters, FilterOptions } from '../types';
import { containerService } from '../services';
import { useAuth } from '../../../context/AuthContext';

interface UseContainerFiltersOptions {
  onFiltersChange?: (filters: ContainerFilters) => void;
  debounceDelay?: number;
  initialFilters?: Partial<ContainerFilters>;
}

interface UseContainerFiltersResult {
  filters: ContainerFilters;
  filterOptions: FilterOptions | null;
  isLoadingOptions: boolean;
  searchValue: string;
  hasAlertsFilter: boolean;
  setSearchValue: (value: string) => void;
  setTypeFilter: (type: ContainerFilters['type']) => void;
  setTenantFilter: (tenant: ContainerFilters['tenant']) => void;
  setPurposeFilter: (purpose: ContainerFilters['purpose']) => void;
  setStatusFilter: (status: ContainerFilters['status']) => void;
  setAlertsFilter: (hasAlerts: boolean) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  isFilterActive: (filterType: keyof ContainerFilters) => boolean;
}

export const useContainerFilters = ({
  onFiltersChange,
  debounceDelay = 300,
  initialFilters = {}
}: UseContainerFiltersOptions = {}): UseContainerFiltersResult => {
  const { authState } = useAuth();
  const defaultFilters = useMemo((): ContainerFilters => ({
    search: '',
    type: 'all',
    tenant: 'all',
    purpose: 'all',
    status: 'all',
    alerts: false,
    ...initialFilters
  }), [initialFilters]);

  const [filters, setFilters] = useState<ContainerFilters>(defaultFilters);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [searchValue, setSearchValueState] = useState(initialFilters.search || '');
  const [hasAlertsFilter, setHasAlertsFilterState] = useState(initialFilters.alerts || false);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  // Load filter options only after authentication
  useEffect(() => {
    // Wait for authentication to complete before making API calls
    if (!authState.isAuthenticated || authState.isLoading) {
      return;
    }

    const loadFilterOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const options = await containerService.getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadFilterOptions();
  }, [authState.isAuthenticated, authState.isLoading]);

  // Debounced search handler
  const setSearchValue = useCallback((value: string) => {
    setSearchValueState(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = window.setTimeout(() => {
      setFilters(prevFilters => {
        const updatedFilters = { ...prevFilters, search: value };
        onFiltersChange?.(updatedFilters);
        return updatedFilters;
      });
    }, debounceDelay);

    setSearchTimeout(timeout);
  }, [onFiltersChange, debounceDelay, searchTimeout]);

  // Individual filter setters
  const setTypeFilter = useCallback((type: ContainerFilters['type']) => {
    const updatedFilters = { ...filters, type };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  }, [filters, onFiltersChange]);

  const setTenantFilter = useCallback((tenant: ContainerFilters['tenant']) => {
    const updatedFilters = { ...filters, tenant };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  }, [filters, onFiltersChange]);

  const setPurposeFilter = useCallback((purpose: ContainerFilters['purpose']) => {
    const updatedFilters = { ...filters, purpose };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  }, [filters, onFiltersChange]);

  const setStatusFilter = useCallback((status: ContainerFilters['status']) => {
    const updatedFilters = { ...filters, status };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  }, [filters, onFiltersChange]);

  const setAlertsFilter = useCallback((hasAlerts: boolean) => {
    setHasAlertsFilterState(hasAlerts);
    const updatedFilters = { ...filters, alerts: hasAlerts };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  }, [filters, onFiltersChange]);

  const clearAllFilters = useCallback(() => {
    const clearedFilters: ContainerFilters = {
      search: '',
      type: 'all',
      tenant: 'all',
      purpose: 'all',
      status: 'all',
      alerts: false
    };
    
    setFilters(clearedFilters);
    setSearchValueState('');
    setHasAlertsFilterState(false);
    
    // Clear any pending search timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
    
    onFiltersChange?.(clearedFilters);
  }, [onFiltersChange, searchTimeout]);

  // Derived state
  const hasActiveFilters = !!(
    filters.search ||
    (filters.type && filters.type !== 'all') ||
    (filters.tenant && filters.tenant !== 'all') ||
    (filters.purpose && filters.purpose !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    filters.alerts
  );

  const isFilterActive = useCallback((filterType: keyof ContainerFilters): boolean => {
    switch (filterType) {
      case 'search':
        return !!filters.search;
      case 'type':
        return filters.type !== 'all' && filters.type !== undefined;
      case 'tenant':
        return filters.tenant !== 'all' && filters.tenant !== undefined;
      case 'purpose':
        return filters.purpose !== 'all' && filters.purpose !== undefined;
      case 'status':
        return filters.status !== 'all' && filters.status !== undefined;
      case 'alerts':
        return !!filters.alerts;
      default:
        return false;
    }
  }, [filters]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return {
    filters,
    filterOptions,
    isLoadingOptions,
    searchValue,
    hasAlertsFilter,
    setSearchValue,
    setTypeFilter,
    setTenantFilter,
    setPurposeFilter,
    setStatusFilter,
    setAlertsFilter,
    clearAllFilters,
    hasActiveFilters,
    isFilterActive
  };
};