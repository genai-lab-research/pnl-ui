import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { SearchFilters } from '../../shared/components/ui/SearchFilters';

const SearchFiltersDemo: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All types');
  const [selectedTenant, setSelectedTenant] = useState<string>('All tenants');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('All purposes');
  const [selectedStatus, setSelectedStatus] = useState<string>('All statuses');
  const [hasAlerts, setHasAlerts] = useState<boolean>(false);

  const handleClearFilters = () => {
    setSearchValue('');
    setSelectedType('All types');
    setSelectedTenant('All tenants');
    setSelectedPurpose('All purposes');
    setSelectedStatus('All statuses');
    setHasAlerts(false);
  };

  const types = ['Container', 'Pod', 'Farm'];
  const tenants = ['Tenant A', 'Tenant B', 'Tenant C'];
  const purposes = ['Production', 'Research', 'Testing'];
  const statuses = ['Active', 'Inactive', 'Maintenance'];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Search and Filters Demo
      </Typography>
      
      <SearchFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        types={types}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        tenants={tenants}
        selectedTenant={selectedTenant}
        onTenantChange={setSelectedTenant}
        purposes={purposes}
        selectedPurpose={selectedPurpose}
        onPurposeChange={setSelectedPurpose}
        statuses={statuses}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        hasAlerts={hasAlerts}
        onAlertsChange={setHasAlerts}
        onClearFilters={handleClearFilters}
      />

      <Paper sx={{ marginTop: 3, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Current Filter State:
        </Typography>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(
            {
              searchValue,
              selectedType,
              selectedTenant,
              selectedPurpose,
              selectedStatus,
              hasAlerts,
            },
            null,
            2
          )}
        </pre>
      </Paper>
    </Box>
  );
};

export default SearchFiltersDemo;