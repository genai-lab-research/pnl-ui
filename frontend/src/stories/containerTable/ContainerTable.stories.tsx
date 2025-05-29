import { StoryFn, Meta } from '@storybook/react';
import { Box, Typography } from '@mui/material';
import { ContainerTable, ContainerRowData } from '../../shared/components/ui/ContainerTable';

export default {
  title: 'UI/ContainerTable',
  component: ContainerTable,
  parameters: {
    docs: {
      description: {
        component: 'A table component specifically designed for displaying container information with status indicators, type icons, and action buttons.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/...',
    },
  },
  argTypes: {
    rows: {
      control: 'object',
      description: 'Array of container rows to display',
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Whether the table should have a sticky header',
      table: {
        defaultValue: { summary: false },
      },
    },
    maxHeight: {
      control: 'number',
      description: 'Maximum height of the table before scrolling',
    },
    zebraStriping: {
      control: 'boolean',
      description: 'Whether to apply zebra striping to rows',
      table: {
        defaultValue: { summary: false },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the table should take the full width of its container',
      table: {
        defaultValue: { summary: true },
      },
    },
    borderColor: {
      control: 'color',
      description: 'Border color for the table',
      table: {
        defaultValue: { summary: '#E9EDF4' },
      },
    },
    headerBgColor: {
      control: 'color',
      description: 'Header background color',
      table: {
        defaultValue: { summary: '#F5F5F7' },
      },
    },
    headerTextColor: {
      control: 'color',
      description: 'Text color for the header',
      table: {
        defaultValue: { summary: 'rgba(76, 78, 100, 0.87)' },
      },
    },
    onActionClick: {
      action: 'action clicked',
      description: 'Function called when row action button is clicked',
    },
  },
} as Meta<typeof ContainerTable>;

// Sample data for stories
const sampleData: ContainerRowData[] = [
  {
    type: 'virtual-farm',
    name: 'virtual-farm-04',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Agriville, USA',
    status: 'Connected',
    created: '30/01/2025',
    modified: '30/01/2025',
    hasAlerts: true,
  },
  {
    type: 'virtual-farm',
    name: 'virtual-farm-03',
    tenant: 'tenant-222',
    purpose: 'Research',
    location: 'Farmington, USA',
    status: 'Maintenance',
    created: '30/01/2025',
    modified: '30/01/2025',
    hasAlerts: false,
  },
  {
    type: 'farm-container',
    name: 'farm-container-04',
    tenant: 'tenant-222',
    purpose: 'Research',
    location: 'Techville, Canada',
    status: 'Created',
    created: '25/01/2025',
    modified: '26/01/2025',
    hasAlerts: false,
  },
  {
    type: 'farm-container',
    name: 'farm-container-07',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Agriville, USA',
    status: 'Connected',
    created: '25/01/2025',
    modified: '26/01/2025',
    hasAlerts: false,
  },
  {
    type: 'virtual-farm',
    name: 'virtual-farm-02',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Croptown, USA',
    status: 'Inactive',
    created: '13/01/2025',
    modified: '15/01/2025',
    hasAlerts: true,
  },
  {
    type: 'farm-container',
    name: 'farm-container-06',
    tenant: 'tenant-5',
    purpose: 'Research',
    location: 'Scienceville, Germany',
    status: 'Connected',
    created: '12/01/2025',
    modified: '18/01/2025',
    hasAlerts: false,
  },
];

// Basic template for individual stories
const Template: StoryFn<typeof ContainerTable> = (args) => <ContainerTable {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {
  rows: sampleData,
};
Default.parameters = {
  docs: {
    description: {
      story: 'Default ContainerTable with all available data columns and sample data.',
    },
  },
};

// Story with zebra striping
export const ZebraStriping = Template.bind({});
ZebraStriping.args = {
  rows: sampleData,
  zebraStriping: true,
};
ZebraStriping.parameters = {
  docs: {
    description: {
      story: 'ContainerTable with zebra striping for better row distinction.',
    },
  },
};

// Story with custom colors
export const CustomStyling = Template.bind({});
CustomStyling.args = {
  rows: sampleData,
  headerBgColor: '#f0f7ff',
  borderColor: '#b3d7ff',
  headerTextColor: '#0052cc',
};
CustomStyling.parameters = {
  docs: {
    description: {
      story: 'ContainerTable with custom styling for header background, border, and text colors.',
    },
  },
};

// Story with scrollable table
export const Scrollable = Template.bind({});
Scrollable.args = {
  rows: sampleData,
  maxHeight: 300,
  stickyHeader: true,
};
Scrollable.parameters = {
  docs: {
    description: {
      story: 'Scrollable ContainerTable with sticky header for larger datasets.',
    },
  },
};

// Comprehensive showcase
export const TableShowcase: StoryFn = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>ContainerTable Component</Typography>
    
    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Default Table</Typography>
    <Box sx={{ mb: 4 }}>
      <ContainerTable rows={sampleData} />
    </Box>
    
    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>With Zebra Striping</Typography>
    <Box sx={{ mb: 4 }}>
      <ContainerTable rows={sampleData} zebraStriping />
    </Box>
    
    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>With Height Limitation and Sticky Header</Typography>
    <Box sx={{ mb: 4 }}>
      <ContainerTable rows={sampleData} maxHeight={300} stickyHeader />
    </Box>
    
    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Custom Styling</Typography>
    <Box sx={{ mb: 4 }}>
      <ContainerTable 
        rows={sampleData} 
        headerBgColor="#f0f7ff"
        borderColor="#b3d7ff"
        headerTextColor="#0052cc"
        zebraStriping
      />
    </Box>
    
    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Responsive Behavior</Typography>
    <Typography variant="body2" sx={{ mb: 1 }}>
      Resize the window to see responsive adjustments at different breakpoints.
    </Typography>
    <Box sx={{ mb: 4 }}>
      <ContainerTable rows={sampleData.slice(0, 3)} />
    </Box>
  </Box>
);

TableShowcase.parameters = {
  docs: {
    description: {
      story: 'A showcase of various ContainerTable configurations and styling options.',
    },
  },
};