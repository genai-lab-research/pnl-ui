import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveContainer } from '../../shared/components/ui/ResponsiveContainer';
import { MetricCard } from '../../shared/components/ui/MetricCard';
import { ResponsiveGrid } from '../../shared/components/ui/ResponsiveGrid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import Co2Icon from '@mui/icons-material/Co2';

const meta = {
  title: 'Layout/ResponsiveContainer',
  component: ResponsiveContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'ResponsiveContainer provides a responsive container with appropriate max-width and padding at different breakpoints.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    maxWidth: { 
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', false],
      description: 'The maximum width of the container at different breakpoints'
    },
    disablePadding: { 
      control: 'boolean',
      description: 'Whether to apply padding to the container'
    },
  },
} satisfies Meta<typeof ResponsiveContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic ResponsiveContainer story
export const Default: Story = {
  args: {
    maxWidth: 'lg',
    disablePadding: false,
  },
  render: (args) => (
    <ResponsiveContainer {...args}>
      <Box sx={{ backgroundColor: '#f3f4f6', padding: 2, borderRadius: 1 }}>
        <Typography variant="h5" gutterBottom>Responsive Container</Typography>
        <Typography>
          This container adapts its maximum width based on the screen size. 
          Try resizing the browser window to see how it behaves on different devices.
        </Typography>
      </Box>
    </ResponsiveContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default ResponsiveContainer with max-width of lg and padding enabled.'
      }
    }
  }
};

// ResponsiveContainer with different max widths
export const MaxWidthVariants: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: 'ResponsiveContainer with different max-width values to demonstrate how they affect the layout.'
      }
    }
  },
  render: () => (
    <>
      <ResponsiveContainer maxWidth="xs">
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#e8eaf6' }}>
          <Typography variant="subtitle2">maxWidth="xs" (600px)</Typography>
        </Paper>
      </ResponsiveContainer>
      
      <ResponsiveContainer maxWidth="sm">
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd' }}>
          <Typography variant="subtitle2">maxWidth="sm" (600px)</Typography>
        </Paper>
      </ResponsiveContainer>
      
      <ResponsiveContainer maxWidth="md">
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#e0f2f1' }}>
          <Typography variant="subtitle2">maxWidth="md" (900px)</Typography>
        </Paper>
      </ResponsiveContainer>
      
      <ResponsiveContainer maxWidth="lg">
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f1f8e9' }}>
          <Typography variant="subtitle2">maxWidth="lg" (1200px)</Typography>
        </Paper>
      </ResponsiveContainer>
      
      <ResponsiveContainer maxWidth="xl">
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#fff8e1' }}>
          <Typography variant="subtitle2">maxWidth="xl" (1400px)</Typography>
        </Paper>
      </ResponsiveContainer>
      
      <ResponsiveContainer maxWidth={false}>
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#fce4ec' }}>
          <Typography variant="subtitle2">maxWidth=false (100%)</Typography>
        </Paper>
      </ResponsiveContainer>
    </>
  ),
};

// ResponsiveContainer with grid layout
export const WithResponsiveGrid: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: 'ResponsiveContainer with ResponsiveGrid to demonstrate a fully responsive layout.'
      }
    }
  },
  render: () => (
    <ResponsiveContainer maxWidth="lg">
      <Typography variant="h5" gutterBottom>Dashboard</Typography>
      
      <ResponsiveGrid 
        columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        spacing={{ xs: 1, sm: 2, md: 2 }}
      >
        <MetricCard 
          title="Air Temperature" 
          value="20°C" 
          targetValue="21°C" 
          icon={<DeviceThermostatIcon />} 
        />
        <MetricCard 
          title="Rel. Humidity" 
          value="65%" 
          targetValue="68%" 
          icon={<WaterDropIcon />} 
        />
        <MetricCard 
          title="CO₂ Level" 
          value="860" 
          targetValue="800-900ppm" 
          icon={<Co2Icon />} 
        />
        <MetricCard 
          title="Wind Speed" 
          value="5 km/h" 
          icon={<AirIcon />} 
        />
      </ResponsiveGrid>
    </ResponsiveContainer>
  ),
};

// Nested ResponsiveContainers
export const NestedContainers: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: 'Nested ResponsiveContainers to create a complex layout.'
      }
    }
  },
  render: () => (
    <ResponsiveContainer maxWidth={false} disablePadding>
      <Box sx={{ backgroundColor: '#e8eaf6', padding: 2 }}>
        <ResponsiveContainer maxWidth="lg">
          <Typography variant="h5" gutterBottom>Full-width Section</Typography>
          <Typography gutterBottom>This section uses a nested container for content.</Typography>
          
          <ResponsiveGrid columns={{ xs: 1, md: 2 }} spacing={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Column 1</Typography>
              <Typography>Content for the first column which will stack on mobile.</Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Column 2</Typography>
              <Typography>Content for the second column which will stack on mobile.</Typography>
            </Paper>
          </ResponsiveGrid>
        </ResponsiveContainer>
      </Box>
      
      <ResponsiveContainer maxWidth="md">
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>Standard Width Section</Typography>
          <Typography>This section uses a standard container width.</Typography>
          
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography>Regular content with standard width container.</Typography>
          </Paper>
        </Box>
      </ResponsiveContainer>
    </ResponsiveContainer>
  ),
};

// Responsive padding demo
export const ResponsivePadding: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: 'ResponsiveContainer with responsive padding that adjusts based on viewport size.'
      }
    }
  },
  render: () => (
    <>
      <ResponsiveContainer maxWidth="lg">
        <Box sx={{ backgroundColor: '#f3f4f6', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ textAlign: 'center', py: 2 }}>
            With Default Padding (changes at breakpoints)
          </Typography>
        </Box>
      </ResponsiveContainer>
      
      <Box sx={{ height: 20 }} />
      
      <ResponsiveContainer maxWidth="lg" disablePadding>
        <Box sx={{ backgroundColor: '#e0f2f1', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ textAlign: 'center', py: 2 }}>
            Without Padding (edge-to-edge)
          </Typography>
        </Box>
      </ResponsiveContainer>
      
      <Box sx={{ height: 20 }} />
      
      <ResponsiveContainer 
        maxWidth="lg" 
        sx={{ 
          px: { xs: 1, sm: 2, md: 4 },
          py: { xs: 1, sm: 1, md: 2 }
        }}
      >
        <Box sx={{ backgroundColor: '#fff8e1', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ textAlign: 'center', py: 2 }}>
            With Custom Responsive Padding
          </Typography>
        </Box>
      </ResponsiveContainer>
    </>
  ),
};