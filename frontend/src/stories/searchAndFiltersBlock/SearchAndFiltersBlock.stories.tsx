import { StoryFn, Meta } from '@storybook/react';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { SearchAndFiltersBlock } from '../../shared/components/ui/SearchAndFiltersBlock';
import { FilterChipOption } from '../../shared/components/ui/FilterChipGroup';

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

export default {
  title: 'UI/SearchAndFiltersBlock',
  component: SearchAndFiltersBlock,
  parameters: {
    docs: {
      description: {
        component: 'A combined block for searching and filtering container data.',
      },
    },
  },
  argTypes: {
    searchValue: {
      control: 'text',
      description: 'Current search value',
    },
    onSearchChange: {
      action: 'searchChanged',
      description: 'Callback fired when search input changes',
    },
    typeOptions: {
      control: 'object',
      description: 'Type filter options',
    },
    tenantOptions: {
      control: 'object',
      description: 'Tenant filter options',
    },
    purposeOptions: {
      control: 'object',
      description: 'Purpose filter options',
    },
    statusOptions: {
      control: 'object',
      description: 'Status filter options',
    },
    filterValues: {
      control: 'object',
      description: 'Current filter values',
    },
    onFilterChange: {
      action: 'filterChanged',
      description: 'Callback fired when filter values change',
    },
    hasAlerts: {
      control: 'boolean',
      description: 'Whether to show only items with alerts',
    },
    onHasAlertsChange: {
      action: 'hasAlertsChanged',
      description: 'Callback fired when has alerts toggle changes',
    },
    onClearFilters: {
      action: 'filtersCleared',
      description: 'Callback fired when clear filters button is clicked',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name',
    },
  },
} as Meta<typeof SearchAndFiltersBlock>;

// Template for the default story
const Template: StoryFn<typeof SearchAndFiltersBlock> = (args) => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    types: '',
    tenants: '',
    purposes: '',
    statuses: '',
  });
  const [hasAlerts, setHasAlerts] = useState(false);
  
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    args.onSearchChange?.(value);
  };
  
  const handleFilterChange = (value: string, filterId: string) => {
    setFilterValues(prev => ({ ...prev, [filterId]: value }));
    args.onFilterChange?.(value, filterId);
  };
  
  const handleHasAlertsChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setHasAlerts(checked);
    args.onHasAlertsChange?.(event, checked);
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
    args.onClearFilters?.();
  };
  
  return (
    <SearchAndFiltersBlock
      {...args}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      hasAlerts={hasAlerts}
      onHasAlertsChange={handleHasAlertsChange}
      onClearFilters={handleClearFilters}
    />
  );
};

// Default story with all filter types
export const Default = Template.bind({});
Default.args = {
  typeOptions,
  tenantOptions,
  purposeOptions,
  statusOptions,
};
Default.parameters = {
  docs: {
    description: {
      story: 'Default SearchAndFiltersBlock with all filter options.',
    },
  },
};

// Interactive showcase
export const InteractiveShowcase: StoryFn = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    types: '',
    tenants: '',
    purposes: '',
    statuses: '',
  });
  const [hasAlerts, setHasAlerts] = useState(false);
  
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Search and Filters Block Component</Typography>
      <Typography variant="body2" paragraph>
        This component combines search input, filter chips, alerts toggle, and clear filters button
        in a unified interface for container data filtering.
      </Typography>
      
      <Box sx={{ mb: 4 }}>
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
      </Box>
      
      <Typography variant="subtitle1" gutterBottom>Current State</Typography>
      <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, mb: 3 }}>
        <pre style={{ margin: 0 }}>
          {JSON.stringify({
            searchValue,
            filterValues,
            hasAlerts,
          }, null, 2)}
        </pre>
      </Box>
    </Box>
  );
};

InteractiveShowcase.parameters = {
  docs: {
    description: {
      story: 'An interactive showcase of the SearchAndFiltersBlock component with state management.',
    },
  },
};