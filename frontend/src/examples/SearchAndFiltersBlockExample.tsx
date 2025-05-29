import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { SearchAndFiltersBlock } from '../shared/components/ui/SearchAndFiltersBlock';
import { FilterChipOption } from '../shared/components/ui/FilterChipGroup';

const SearchAndFiltersBlockExample: React.FC = () => {
  // Example filter options
  const typeOptions: FilterChipOption[] = [
    { label: 'All types', value: 'types' },
    { label: 'Virtual Farm', value: 'virtual-farm' },
    { label: 'Farm Container', value: 'farm-container' }
  ];
  
  const tenantOptions: FilterChipOption[] = [
    { label: 'All tenants', value: 'tenants' },
    { label: 'Tenant A', value: 'tenant-a' },
    { label: 'Tenant B', value: 'tenant-b' }
  ];
  
  const purposeOptions: FilterChipOption[] = [
    { label: 'All purposes', value: 'purposes' },
    { label: 'Development', value: 'development' },
    { label: 'Production', value: 'production' },
    { label: 'Testing', value: 'testing' }
  ];
  
  const statusOptions: FilterChipOption[] = [
    { label: 'All statuses', value: 'statuses' },
    { label: 'Connected', value: 'connected' },
    { label: 'Disconnected', value: 'disconnected' },
    { label: 'Maintenance', value: 'maintenance' }
  ];
  
  // State management
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    types: '',
    tenants: '',
    purposes: '',
    statuses: '',
  });
  const [hasAlerts, setHasAlerts] = useState(false);
  
  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };
  
  const handleFilterChange = (value: string, filterId: string) => {
    setFilterValues(prev => ({ ...prev, [filterId]: value }));
  };
  
  const handleHasAlertsChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setHasAlerts(checked);
  };
  
  const handleClearFilters = () => {
    setSearchValue('');
    setFilterValues({
      types: '',
      tenants: '',
      purposes: '',
      statuses: '',
    });
    setHasAlerts(false);
  };
  
  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Search and Filters Block Example
      </Typography>
      
      <Paper elevation={0} sx={{ mb: 4 }}>
        <SearchAndFiltersBlock
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          typeOptions={typeOptions}
          tenantOptions={tenantOptions}
          purposeOptions={purposeOptions}
          statusOptions={statusOptions}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          hasAlerts={hasAlerts}
          onHasAlertsChange={handleHasAlertsChange}
          onClearFilters={handleClearFilters}
        />
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Current Filter State
      </Typography>
      
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Search Value:
        </Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', mb: 2 }}>
          <code>{searchValue || '(empty)'}</code>
        </Paper>
        
        <Typography variant="subtitle1" gutterBottom>
          Filter Values:
        </Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', mb: 2 }}>
          <pre style={{ margin: 0, overflow: 'auto' }}>
            {JSON.stringify(filterValues, null, 2)}
          </pre>
        </Paper>
        
        <Typography variant="subtitle1" gutterBottom>
          Show Only Items with Alerts:
        </Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <code>{hasAlerts ? 'Yes' : 'No'}</code>
        </Paper>
      </Paper>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Component Usage
        </Typography>
        <Typography variant="body2">
          The SearchAndFiltersBlock component provides a unified interface for searching and filtering container data.
          It combines a search input, filter dropdowns, an alerts toggle, and a clear filters button in a responsive layout.
        </Typography>
      </Box>
    </Box>
  );
};

export default SearchAndFiltersBlockExample;