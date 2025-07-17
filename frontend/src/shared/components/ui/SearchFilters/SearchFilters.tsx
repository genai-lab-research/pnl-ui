import React, { useState, useCallback } from 'react';
import { MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchFiltersProps } from './types';
import {
  SearchFiltersContainer,
  SearchField,
  FilterSelect,
  ClearFiltersButton,
  AlertsContainer,
  AlertsSwitch,
} from './SearchFilters.styles';

/**
 * SearchFilters component provides a search bar and various filter controls
 * for filtering and searching containers in the Vertical Farming Control Panel UI.
 */
export const SearchFilters: React.FC<SearchFiltersProps> = ({
  onSearchChange,
  onTypeChange,
  onTenantChange,
  onPurposeChange,
  onStatusChange,
  onAlertsChange,
  onClearFilters,
  searchValue = '',
  types = [],
  selectedType = 'All types',
  tenants = [],
  selectedTenant = 'All tenants',
  purposes = [],
  selectedPurpose = 'All purposes',
  statuses = [],
  selectedStatus = 'All statuses',
  hasAlerts = false,
}) => {
  const [search, setSearch] = useState<string>(searchValue);
  const [type, setType] = useState<string>(selectedType);
  const [tenant, setTenant] = useState<string>(selectedTenant);
  const [purpose, setPurpose] = useState<string>(selectedPurpose);
  const [status, setStatus] = useState<string>(selectedStatus);
  const [alerts, setAlerts] = useState<boolean>(hasAlerts);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearch(value);
      onSearchChange?.(value);
    },
    [onSearchChange]
  );

  const handleTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setType(value);
      onTypeChange?.(value);
    },
    [onTypeChange]
  );

  const handleTenantChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setTenant(value);
      onTenantChange?.(value);
    },
    [onTenantChange]
  );

  const handlePurposeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setPurpose(value);
      onPurposeChange?.(value);
    },
    [onPurposeChange]
  );

  const handleStatusChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setStatus(value);
      onStatusChange?.(value);
    },
    [onStatusChange]
  );

  const handleAlertsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;
      setAlerts(value);
      onAlertsChange?.(value);
    },
    [onAlertsChange]
  );

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setType('All types');
    setTenant('All tenants');
    setPurpose('All purposes');
    setStatus('All statuses');
    setAlerts(false);
    onClearFilters?.();
  }, [onClearFilters]);

  return (
    <SearchFiltersContainer>
      <SearchField
        placeholder="Search containers..."
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: <SearchIcon color="action" />,
        }}
        size="small"
      />

      <FilterSelect
        select
        value={type}
        onChange={handleTypeChange}
        size="small"
        InputProps={{
          style: { minWidth: '120px' }
        }}
      >
        <MenuItem value="All types">All types</MenuItem>
        {types.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </FilterSelect>

      <FilterSelect
        select
        value={tenant}
        onChange={handleTenantChange}
        size="small"
        InputProps={{
          style: { minWidth: '120px' }
        }}
      >
        <MenuItem value="All tenants">All tenants</MenuItem>
        {tenants.map((tenant) => (
          <MenuItem key={tenant} value={tenant}>
            {tenant}
          </MenuItem>
        ))}
      </FilterSelect>

      <FilterSelect
        select
        value={purpose}
        onChange={handlePurposeChange}
        size="small"
        InputProps={{
          style: { minWidth: '120px' }
        }}
      >
        <MenuItem value="All purposes">All purposes</MenuItem>
        {purposes.map((purpose) => (
          <MenuItem key={purpose} value={purpose}>
            {purpose}
          </MenuItem>
        ))}
      </FilterSelect>

      <FilterSelect
        select
        value={status}
        onChange={handleStatusChange}
        size="small"
        InputProps={{
          style: { minWidth: '120px' }
        }}
      >
        <MenuItem value="All statuses">All statuses</MenuItem>
        {statuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </FilterSelect>

      <AlertsContainer>
        Has Alerts
        <AlertsSwitch
          checked={alerts}
          onChange={handleAlertsChange}
          inputProps={{ 'aria-label': 'has alerts toggle' }}
        />
      </AlertsContainer>

      <ClearFiltersButton
        variant="text"
        color="primary"
        onClick={handleClearFilters}
      >
        Clear Filters
      </ClearFiltersButton>
    </SearchFiltersContainer>
  );
};