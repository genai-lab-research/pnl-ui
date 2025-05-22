import React from 'react';
import { Box, FormControl, Select, MenuItem, SelectChangeEvent, Switch, Typography } from '@mui/material';
import SearchInput from '../../shared/components/ui/SearchInput/SearchInput';
import { ClearFiltersButton } from '../../shared/components/ui/Button';

export interface FilterSectionProps {
  /**
   * Search value
   */
  searchValue: string;

  /**
   * Handler for search value changes
   */
  onSearchChange: (value: string) => void;

  /**
   * Handler for search submission
   */
  onSearch: (value: string) => void;

  /**
   * Selected container type filter
   */
  containerType: string;

  /**
   * Handler for container type filter changes
   */
  onContainerTypeChange: (value: string) => void;

  /**
   * Selected tenant filter
   */
  tenant: string;

  /**
   * Handler for tenant filter changes
   */
  onTenantChange: (value: string) => void;
  
  /**
   * Available tenant options
   */
  tenantOptions?: {id: string, name: string}[];

  /**
   * Selected purpose filter
   */
  purpose: string;

  /**
   * Handler for purpose filter changes
   */
  onPurposeChange: (value: string) => void;

  /**
   * Selected status filter
   */
  status: string;

  /**
   * Handler for status filter changes
   */
  onStatusChange: (value: string) => void;

  /**
   * Whether to show only items with alerts
   */
  hasAlerts: boolean;

  /**
   * Handler for has alerts filter changes
   */
  onHasAlertsChange: (value: boolean) => void;

  /**
   * Handler for clearing all filters
   */
  onClearFilters: () => void;

  /**
   * Optional custom class name
   */
  className?: string;
}

/**
 * FilterSection component for filtering containers
 */
export const FilterSection: React.FC<FilterSectionProps> = ({
  searchValue,
  onSearchChange,
  onSearch,
  containerType,
  onContainerTypeChange,
  tenant,
  onTenantChange,
  tenantOptions = [],
  purpose,
  onPurposeChange,
  status,
  onStatusChange,
  hasAlerts,
  onHasAlertsChange,
  onClearFilters,
  className,
}) => {

  const handleTypeChange = (event: SelectChangeEvent) => {
    onContainerTypeChange(event.target.value);
  };

  const handleTenantChange = (event: SelectChangeEvent) => {
    onTenantChange(event.target.value);
  };

  const handlePurposeChange = (event: SelectChangeEvent) => {
    onPurposeChange(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    onStatusChange(event.target.value);
  };

  const handleAlertsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onHasAlertsChange(event.target.checked);
  };

  // Common styles for select components to match the reference UI
  const selectStyles = {
    '& .MuiOutlinedInput-root': {
      height: '40px',
      border: '1px solid #E0E0E0',
      borderRadius: '4px',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2196f3',
      },
    },
    '& .MuiSelect-select': {
      paddingTop: '8px',
      paddingBottom: '8px',
      fontWeight: 500,
      color: '#424242',
    }
  };

  return (
    <Box className={className} sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 2, 
      alignItems: 'center'
    }}>
      {/* Search */}
      <Box sx={{ flex: '1 1 400px' }}>
        <SearchInput
          placeholder="Search containers..."
          value={searchValue}
          onChange={onSearchChange}
          onSearch={onSearch}
        />
      </Box>

      {/* Type Filter */}
      <Box sx={{ flex: '1 1 140px', maxWidth: '180px' }}>
        <FormControl fullWidth size="small" sx={selectStyles}>
          <Select
            id="type-filter"
            value={containerType}
            onChange={handleTypeChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Container type filter' }}
          >
            <MenuItem value="all">All types</MenuItem>
            <MenuItem value="physical">Physical</MenuItem>
            <MenuItem value="virtual">Virtual</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tenant Filter */}
      <Box sx={{ flex: '1 1 140px', maxWidth: '180px' }}>
        <FormControl fullWidth size="small" sx={selectStyles}>
          <Select
            id="tenant-filter"
            value={tenant}
            onChange={handleTenantChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Tenant filter' }}
          >
            <MenuItem value="all">All tenants</MenuItem>
            {tenantOptions?.map(tenant => (
              <MenuItem key={tenant.id} value={tenant.id}>{tenant.name}</MenuItem>
            ))}
            {/* Fallback items if no tenants are provided */}
            {(!tenantOptions || tenantOptions.length === 0) && (
              <>
                <MenuItem value="tenant-123">tenant-123</MenuItem>
                <MenuItem value="tenant-222">tenant-222</MenuItem>
                <MenuItem value="tenant-5">tenant-5</MenuItem>
              </>
            )}
          </Select>
        </FormControl>
      </Box>

      {/* Purpose Filter */}
      <Box sx={{ flex: '1 1 140px', maxWidth: '180px' }}>
        <FormControl fullWidth size="small" sx={selectStyles}>
          <Select
            id="purpose-filter"
            value={purpose}
            onChange={handlePurposeChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Purpose filter' }}
          >
            <MenuItem value="all">All purposes</MenuItem>
            <MenuItem value="development">Development</MenuItem>
            <MenuItem value="research">Research</MenuItem>
            <MenuItem value="production">Production</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Status Filter */}
      <Box sx={{ flex: '1 1 140px', maxWidth: '180px' }}>
        <FormControl fullWidth size="small" sx={selectStyles}>
          <Select
            id="status-filter"
            value={status}
            onChange={handleStatusChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Status filter' }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="connected">Connected</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
            <MenuItem value="created">Created</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Alerts Toggle */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexGrow: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Typography variant="body2" sx={{ mr: 1, fontSize: '0.875rem', color: '#616161' }}>
            Has Alerts
          </Typography>
          <Switch 
            checked={hasAlerts} 
            onChange={handleAlertsChange}
            color="primary"
            size="medium"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#2196f3',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#2196f3',
              },
            }}
          />
        </Box>
        
        {/* Clear Filters Button */}
        <ClearFiltersButton onClick={onClearFilters} />
      </Box>
    </Box>
  );
};

export default FilterSection;