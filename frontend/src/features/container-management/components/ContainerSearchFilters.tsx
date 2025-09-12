import React, { useCallback } from 'react';
import { GenerationBlock } from '../../../shared/components/ui/GenerationBlock';
import { useContainerFilters } from '../hooks/useContainerFilters';
import { ContainerSearchFiltersViewModel } from '../viewmodels/ContainerSearchFilters.viewmodel';
import { FilterChip, FilterChipOption } from '../../../shared/components/ui/GenerationBlock/types';
import { StyledContainerSearchFilters } from './ContainerSearchFilters.style';

interface ContainerSearchFiltersProps {
  className?: string;
  containerFilters?: ReturnType<typeof useContainerFilters>;
}

export const ContainerSearchFilters: React.FC<ContainerSearchFiltersProps> = ({ 
  className, 
  containerFilters: passedFilters 
}) => {
  const viewModel = new ContainerSearchFiltersViewModel();
  const defaultFilters = useContainerFilters();
  
  // Use passed filters if provided, otherwise use default
  const {
    searchValue,
    hasAlertsFilter,
    filterOptions,
    isLoadingOptions,
    setSearchValue,
    setTypeFilter,
    setTenantFilter,
    setPurposeFilter,
    setStatusFilter,
    setAlertsFilter,
    clearAllFilters,
    filters
  } = passedFilters || defaultFilters;

  // Convert filter options to chip format
  const filterChips: FilterChip[] = [
    {
      id: 'type',
      label: filters.type === 'all' ? 'All Types' : filters.type || 'All Types',
      isActive: filters.type !== 'all',
      options: [
        { id: 'all', label: 'All Types', value: 'all' },
        { id: 'physical', label: 'Physical', value: 'physical' },
        { id: 'virtual', label: 'Virtual', value: 'virtual' }
      ],
      selectedOption: filters.type === 'all' ? 
        { id: 'all', label: 'All Types', value: 'all' } : 
        { id: filters.type || 'all', label: filters.type === 'physical' ? 'Physical' : 'Virtual', value: filters.type || 'all' }
    },
    {
      id: 'tenant',
      label: filters.tenant === 'all' ? 'All Tenants' : `Tenant ${filters.tenant}`,
      isActive: filters.tenant !== 'all',
      options: [
        { id: 'all', label: 'All Tenants', value: 'all' },
        ...(filterOptions?.tenants?.map(t => ({
          id: t.id.toString(),
          label: t.name,
          value: t.id.toString()
        })) || [])
      ],
      selectedOption: filters.tenant === 'all' ? 
        { id: 'all', label: 'All Tenants', value: 'all' } : 
        filterOptions?.tenants?.find(t => t.id.toString() === filters.tenant?.toString()) ? 
          { id: filters.tenant!.toString(), label: filterOptions.tenants.find(t => t.id.toString() === filters.tenant?.toString())!.name, value: filters.tenant!.toString() } :
          { id: 'all', label: 'All Tenants', value: 'all' }
    },
    {
      id: 'purpose',
      label: filters.purpose === 'all' ? 'All Purposes' : filters.purpose || 'All Purposes',
      isActive: filters.purpose !== 'all',
      options: [
        { id: 'all', label: 'All Purposes', value: 'all' },
        ...(filterOptions?.purposes?.map(p => ({
          id: p,
          label: p.charAt(0).toUpperCase() + p.slice(1),
          value: p
        })) || [])
      ],
      selectedOption: filters.purpose === 'all' ? 
        { id: 'all', label: 'All Purposes', value: 'all' } : 
        { id: filters.purpose || 'all', label: (filters.purpose || 'all').charAt(0).toUpperCase() + (filters.purpose || 'all').slice(1), value: filters.purpose || 'all' }
    },
    {
      id: 'status',
      label: filters.status === 'all' ? 'All Statuses' : filters.status || 'All Statuses',
      isActive: filters.status !== 'all',
      options: [
        { id: 'all', label: 'All Statuses', value: 'all' },
        ...(filterOptions?.statuses?.map(s => ({
          id: s,
          label: s.charAt(0).toUpperCase() + s.slice(1),
          value: s
        })) || [])
      ],
      selectedOption: filters.status === 'all' ? 
        { id: 'all', label: 'All Statuses', value: 'all' } : 
        { id: filters.status || 'all', label: (filters.status || 'all').charAt(0).toUpperCase() + (filters.status || 'all').slice(1), value: filters.status || 'all' }
    }
  ];

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, [setSearchValue]);

  const handleChipClick = useCallback((chipId: string) => {
    // Clicking chip toggles its active state by setting it to 'all'
    switch (chipId) {
      case 'type':
        setTypeFilter(filters.type === 'all' ? 'physical' : 'all');
        break;
      case 'tenant':
        setTenantFilter(filters.tenant === 'all' ? filterOptions?.tenants?.[0]?.id || 'all' : 'all');
        break;
      case 'purpose':
        setPurposeFilter(filters.purpose === 'all' ? 'development' : 'all');
        break;
      case 'status':
        setStatusFilter(filters.status === 'all' ? 'active' : 'all');
        break;
    }
  }, [filters, filterOptions, setTypeFilter, setTenantFilter, setPurposeFilter, setStatusFilter]);

  const handleChipOptionSelect = useCallback((chipId: string, option: FilterChipOption) => {
    switch (chipId) {
      case 'type':
        setTypeFilter(option.value as any);
        break;
      case 'tenant':
        setTenantFilter(option.value === 'all' ? 'all' : parseInt(option.value));
        break;
      case 'purpose':
        setPurposeFilter(option.value as any);
        break;
      case 'status':
        setStatusFilter(option.value as any);
        break;
    }
  }, [setTypeFilter, setTenantFilter, setPurposeFilter, setStatusFilter]);

  const handleAlertsToggle = useCallback((enabled: boolean) => {
    setAlertsFilter(enabled);
  }, [setAlertsFilter]);

  const handleClearFilters = useCallback(() => {
    clearAllFilters();
  }, [clearAllFilters]);

  return (
    <StyledContainerSearchFilters className={className}>
      <GenerationBlock
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        filterChips={filterChips}
        onChipClick={handleChipClick}
        onChipOptionSelect={handleChipOptionSelect}
        hasAlerts={hasAlertsFilter}
        onAlertsToggle={handleAlertsToggle}
        onClearFilters={handleClearFilters}
        isSearchLoading={false}
        isFilterLoading={isLoadingOptions}
      />
    </StyledContainerSearchFilters>
  );
};

export default ContainerSearchFilters;