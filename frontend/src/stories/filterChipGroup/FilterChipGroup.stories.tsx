import { StoryFn, Meta } from '@storybook/react';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { FilterChipGroup, FilterChipOption } from '../../shared/components/ui/FilterChipGroup';

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
  title: 'UI/FilterChipGroup',
  component: FilterChipGroup,
  parameters: {
    docs: {
      description: {
        component: 'A group of filter chips for selecting options from dropdown menus.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/...',
    },
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of filter options for each chip',
    },
    values: {
      control: 'object',
      description: 'Current selected values (key-value pairs)',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when a chip selection changes',
    },
    className: {
      control: 'text',
      description: 'Optional CSS class name',
    },
  },
} as Meta<typeof FilterChipGroup>;

// Template for the default story
const Template: StoryFn<typeof FilterChipGroup> = (args) => {
  const [values, setValues] = useState<Record<string, string>>({
    types: '',
    tenants: '',
    purposes: '',
    statuses: '',
  });
  
  const handleChange = (value: string, chipId: string) => {
    setValues(prev => ({ ...prev, [chipId]: value }));
    args.onChange?.(value, chipId);
  };
  
  return (
    <FilterChipGroup
      {...args}
      values={values}
      onChange={handleChange}
    />
  );
};

// Default story with all filter types
export const Default = Template.bind({});
Default.args = {
  options: [
    typeOptions[0],
    tenantOptions[0],
    purposeOptions[0],
    statusOptions[0],
  ],
};
Default.parameters = {
  docs: {
    description: {
      story: 'Default FilterChipGroup with four filter categories.',
    },
  },
};

// Interactive showcase with all filters
export const FilterChipGroupShowcase: StoryFn = () => {
  const [values, setValues] = useState<Record<string, string>>({
    types: '',
    tenants: '',
    purposes: '',
    statuses: '',
    other: '',
  });
  
  const handleChange = (value: string, chipId: string) => {
    setValues(prev => ({ ...prev, [chipId]: value }));
    console.log(`Filter changed: ${chipId} = ${value}`);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Filter Chip Group Component</Typography>
      <Typography variant="body2" paragraph>
        The FilterChipGroup component provides a horizontal group of filter chips with dropdown options.
        Each chip acts as a select input for different filtering categories.
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>Basic Filter Set</Typography>
        <FilterChipGroup
          options={[
            typeOptions[0],
            tenantOptions[0],
            purposeOptions[0],
            statusOptions[0],
          ]}
          values={values}
          onChange={handleChange}
        />
      </Box>
      
      <Typography variant="subtitle1" gutterBottom>Selected Filters</Typography>
      <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, mb: 3 }}>
        <pre style={{ margin: 0 }}>
          {JSON.stringify(values, null, 2)}
        </pre>
      </Box>
      
      <Typography variant="subtitle1" gutterBottom>Responsive Behavior</Typography>
      <Typography variant="body2" paragraph>
        Resize the window to see how the filter chips adapt to different screen sizes:
      </Typography>
      
      <Box sx={{ 
        p: 2, 
        border: '1px dashed #ccc', 
        borderRadius: 1, 
        mb: 4,
        maxWidth: '100%',
        overflowX: 'auto'
      }}>
        <FilterChipGroup
          options={[
            typeOptions[0],
            tenantOptions[0],
            purposeOptions[0],
            statusOptions[0],
            { label: 'Other', value: 'other' }
          ]}
          values={values}
          onChange={handleChange}
        />
      </Box>
    </Box>
  );
};

FilterChipGroupShowcase.parameters = {
  docs: {
    description: {
      story: 'An interactive showcase of the FilterChipGroup component with various configurations.',
    },
  },
};