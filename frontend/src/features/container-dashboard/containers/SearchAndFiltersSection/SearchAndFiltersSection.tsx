import React from 'react';
import { GenerationBlock } from '../../../../shared/components/ui/GenerationBlock';
import { FilterChipOption } from '../../../../shared/components/ui/GenerationBlock/types';
import { FiltersDomainModel } from '../../models';

interface SearchAndFiltersSectionProps {
  filters: FiltersDomainModel;
  onSearchChange: (query: string) => Promise<void>;
  onFiltersChange: (filters: FiltersDomainModel) => Promise<void>;
  onClearFilters: () => Promise<void>;
  isSearchLoading?: boolean;
  isFilterLoading?: boolean;
}

export const SearchAndFiltersSection: React.FC<SearchAndFiltersSectionProps> = ({
  filters,
  onSearchChange,
  onFiltersChange,
  onClearFilters,
  isSearchLoading = false,
  isFilterLoading = false,
}) => {
  // Create dropdown options from available filter options
  const typeOptions: FilterChipOption[] = [
    { id: 'all', label: 'All types', value: 'all' },
    { id: 'physical', label: 'Physical', value: 'physical' },
    { id: 'virtual', label: 'Virtual', value: 'virtual' }
  ];

  const tenantOptions: FilterChipOption[] = [
    { id: 'all', label: 'All tenants', value: 'all' },
    ...filters.availableOptions.tenants.map(tenant => ({
      id: tenant.id.toString(),
      label: tenant.name,
      value: tenant.id.toString()
    }))
  ];

  const purposeOptions: FilterChipOption[] = [
    { id: 'all', label: 'All purposes', value: 'all' },
    ...filters.availableOptions.purposes.map(purpose => ({
      id: purpose,
      label: purpose.charAt(0).toUpperCase() + purpose.slice(1),
      value: purpose
    }))
  ];

  const statusOptions: FilterChipOption[] = [
    { id: 'all', label: 'All statuses', value: 'all' },
    ...filters.availableOptions.statuses.map(status => ({
      id: status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: status
    }))
  ];

  // Get selected options based on current filter state
  const getSelectedOption = (options: FilterChipOption[], currentValue: string | number | null) => {
    if (currentValue === null || currentValue === 'all') {
      return options.find(opt => opt.value === 'all');
    }
    return options.find(opt => opt.value === currentValue.toString());
  };

  const filterChips = [
    {
      id: 'type',
      label: 'Type',
      isActive: filters.state.type !== 'all',
      options: typeOptions,
      selectedOption: getSelectedOption(typeOptions, filters.state.type)
    },
    {
      id: 'tenant',
      label: 'Tenant',
      isActive: filters.state.tenant !== null,
      options: tenantOptions,
      selectedOption: getSelectedOption(tenantOptions, filters.state.tenant)
    },
    {
      id: 'purpose',
      label: 'Purpose',
      isActive: filters.state.purpose !== 'all',
      options: purposeOptions,
      selectedOption: getSelectedOption(purposeOptions, filters.state.purpose)
    },
    {
      id: 'status',
      label: 'Status',
      isActive: filters.state.status !== 'all',
      options: statusOptions,
      selectedOption: getSelectedOption(statusOptions, filters.state.status)
    },
  ];

  return (
    <GenerationBlock
      searchValue={filters.state.search}
      onSearchChange={onSearchChange}
      isSearchLoading={isSearchLoading}
      isFilterLoading={isFilterLoading}
      filterChips={filterChips}
      onChipClick={(chipId: string) => {
        // Toggle chip state by clearing the filter
        const newFilters = { ...filters.state };
        switch (chipId) {
          case 'type':
            newFilters.type = 'all';
            break;
          case 'tenant':
            newFilters.tenant = null;
            break;
          case 'purpose':
            newFilters.purpose = 'all';
            break;
          case 'status':
            newFilters.status = 'all';
            break;
        }
        onFiltersChange(new FiltersDomainModel(newFilters, filters.availableOptions));
      }}
      onChipOptionSelect={(chipId: string, option: FilterChipOption) => {
        const newFilters = { ...filters.state };
        switch (chipId) {
          case 'type':
            newFilters.type = option.value as 'physical' | 'virtual' | 'all';
            break;
          case 'tenant':
            newFilters.tenant = option.value === 'all' ? null : parseInt(option.value, 10);
            break;
          case 'purpose':
            newFilters.purpose = option.value as 'development' | 'research' | 'production' | 'all';
            break;
          case 'status':
            newFilters.status = option.value as 'created' | 'active' | 'maintenance' | 'inactive' | 'all';
            break;
        }
        onFiltersChange(new FiltersDomainModel(newFilters, filters.availableOptions));
      }}
      hasAlerts={filters.state.hasAlerts || false}
      onAlertsToggle={(hasAlerts: boolean) => {
        const newFilters = { ...filters.state, hasAlerts: hasAlerts || null };
        onFiltersChange(new FiltersDomainModel(newFilters, filters.availableOptions));
      }}
      onClearFilters={onClearFilters}
    />
  );
};