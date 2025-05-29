import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { FilterChipGroup, FilterChipOption } from '../shared/components/ui/FilterChipGroup';

const FilterChipGroupExample: React.FC = () => {
  // Define filter options
  const typeOptions: FilterChipOption[] = [
    { label: 'All types', value: 'types' },
  ];
  
  const tenantOptions: FilterChipOption[] = [
    { label: 'All tenants', value: 'tenants' },
  ];
  
  const purposeOptions: FilterChipOption[] = [
    { label: 'All purposes', value: 'purposes' },
  ];
  
  const statusOptions: FilterChipOption[] = [
    { label: 'All statuses', value: 'statuses' },
  ];
  
  // Initial state for filter values
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    types: '',
    tenants: '',
    purposes: '',
    statuses: '',
  });
  
  // Handle filter changes
  const handleFilterChange = (value: string, chipId: string) => {
    setFilterValues(prev => ({ 
      ...prev, 
      [chipId]: value 
    }));
    
    // In a real application, you would use these values to filter your data
    console.log(`Filter changed: ${chipId} = ${value}`);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Filter Chip Group Example
      </Typography>
      
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Container Filters
        </Typography>
        
        <FilterChipGroup
          options={[
            typeOptions[0],
            tenantOptions[0],
            purposeOptions[0],
            statusOptions[0],
          ]}
          values={filterValues}
          onChange={handleFilterChange}
        />
      </Paper>
      
      <Typography variant="subtitle1" gutterBottom>
        Selected Filters:
      </Typography>
      
      <Paper elevation={1} sx={{ p: 2 }}>
        <pre style={{ margin: 0, overflow: 'auto' }}>
          {JSON.stringify(filterValues, null, 2)}
        </pre>
      </Paper>
    </Box>
  );
};

export default FilterChipGroupExample;