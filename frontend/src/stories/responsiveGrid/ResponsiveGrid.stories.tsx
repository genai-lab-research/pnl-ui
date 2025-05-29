import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveGrid } from '../../shared/components/ui/ResponsiveGrid';
import { MetricCard } from '../../shared/components/ui/MetricCard';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import Co2Icon from '@mui/icons-material/Co2';
import { ResponsiveContainer } from '../../shared/components/ui/ResponsiveContainer';

const meta = {
  title: 'Layout/ResponsiveGrid',
  component: ResponsiveGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'ResponsiveGrid provides a responsive grid layout with configurable spacing and column counts at different breakpoints.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    spacing: { 
      control: 'number',
      description: 'The spacing between grid items'
    },
    columns: {
      control: 'object',
      description: 'The number of columns the grid should have at different breakpoints'
    },
  },
} satisfies Meta<typeof ResponsiveGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic grid with default configuration
export const Default: Story = {
  args: {
    spacing: 2,
    columns: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  },
  render: (args) => (
    <ResponsiveContainer maxWidth="lg">
      <ResponsiveGrid {...args}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Paper 
            key={item}
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              bgcolor: '#f5f5f5',
              height: '100%'
            }}
          >
            <Typography>Grid Item {item}</Typography>
          </Paper>
        ))}
      </ResponsiveGrid>
    </ResponsiveContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default ResponsiveGrid with responsive column configuration.'
      }
    }
  }
};

// Grid with different spacings
export const SpacingVariants: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: 'ResponsiveGrid with different spacing configurations.'
      }
    }
  },
  render: () => (
    <ResponsiveContainer maxWidth="lg">
      <Typography variant="h6" gutterBottom>Spacing: 1</Typography>
      <ResponsiveGrid spacing={1} columns={{ xs: 1, sm: 2, md: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Paper 
            key={item}
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              bgcolor: '#e3f2fd',
              height: '100%'
            }}
          >
            <Typography>Item {item}</Typography>
          </Paper>
        ))}
      </ResponsiveGrid>
      
      <Box sx={{ height: 32 }} />
      
      <Typography variant="h6" gutterBottom>Spacing: 3</Typography>
      <ResponsiveGrid spacing={3} columns={{ xs: 1, sm: 2, md: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Paper 
            key={item}
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              bgcolor: '#e0f7fa',
              height: '100%'
            }}
          >
            <Typography>Item {item}</Typography>
          </Paper>
        ))}
      </ResponsiveGrid>
      
      <Box sx={{ height: 32 }} />
      
      <Typography variant="h6" gutterBottom>Responsive Spacing</Typography>
      <ResponsiveGrid 
        spacing={{ xs: 1, sm: 2, md: 3 }}
        columns={{ xs: 1, sm: 2, md: 4 }}
      >
        {[1, 2, 3, 4].map((item) => (
          <Paper 
            key={item}
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              bgcolor: '#f0f4c3',
              height: '100%'
            }}
          >
            <Typography>Item {item}</Typography>
          </Paper>
        ))}
      </ResponsiveGrid>
    </ResponsiveContainer>
  ),
};

// Grid with different column configurations
export const ColumnVariants: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: 'ResponsiveGrid with different column configurations at different breakpoints.'
      }
    }
  },
  render: () => (
    <ResponsiveContainer maxWidth="lg">
      <Typography variant="h6" gutterBottom>Single Column (xs: 1)</Typography>
      <ResponsiveGrid spacing={2} columns={{ xs: 1 }} sx={{ mb: 4 }}>
        {[1, 2, 3].map((item) => (
          <Paper 
            key={item}
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              bgcolor: '#e8eaf6',
              height: '100%'
            }}
          >
            <Typography>Item {item}</Typography>
          </Paper>
        ))}
      </ResponsiveGrid>
      
      <Typography variant="h6" gutterBottom>Two Columns (xs: 1, sm: 2)</Typography>
      <ResponsiveGrid spacing={2} columns={{ xs: 1, sm: 2 }} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Paper 
            key={item}
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              bgcolor: '#e1f5fe',
              height: '100%'
            }}
          >
            <Typography>Item {item}</Typography>
          </Paper>
        ))}
      </ResponsiveGrid>
      
      <Typography variant="h6" gutterBottom>Responsive Columns (xs: 1, sm: 2, md: 3, lg: 6)</Typography>
      <ResponsiveGrid spacing={2} columns={{ xs: 1, sm: 2, md: 3, lg: 6 }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Paper 
            key={item}
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              bgcolor: '#f3e5f5',
              height: '100%'
            }}
          >
            <Typography>Item {item}</Typography>
          </Paper>
        ))}
      </ResponsiveGrid>
    </ResponsiveContainer>
  ),
};

// Grid with components
export const WithComponents: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: 'ResponsiveGrid with MetricCard components to demonstrate real-world usage.'
      }
    }
  },
  render: () => (
    <ResponsiveContainer maxWidth="lg">
      <Typography variant="h5" gutterBottom>Dashboard Metrics</Typography>
      
      <ResponsiveGrid 
        spacing={{ xs: 1, sm: 2, md: 3 }}
        columns={{ xs: 1, sm: 2, md: 2, lg: 4 }}
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
        <MetricCard 
          title="Air Quality" 
          value="Good" 
          icon={<AirIcon />} 
        />
        <MetricCard 
          title="Pressure" 
          value="1013 hPa" 
          targetValue="1010-1020" 
          icon={<DeviceThermostatIcon />} 
        />
      </ResponsiveGrid>
    </ResponsiveContainer>
  ),
};

// Grid with different sized items
export const MixedSizeItems: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: 'ResponsiveGrid with items of different sizes to demonstrate a more complex layout.'
      }
    }
  },
  render: () => (
    <ResponsiveContainer maxWidth="lg">
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
        {/* Full width item */}
        <Box sx={{ gridColumn: 'span 12' }}>
          <Paper sx={{ p: 3, bgcolor: '#bbdefb', height: '100%' }}>
            <Typography variant="h6">Full Width (12 columns)</Typography>
          </Paper>
        </Box>
        
        {/* Half width items */}
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Paper sx={{ p: 3, bgcolor: '#c5cae9', height: '100%' }}>
            <Typography variant="h6">Half Width (6 columns)</Typography>
          </Paper>
        </Box>
        
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Paper sx={{ p: 3, bgcolor: '#c5cae9', height: '100%' }}>
            <Typography variant="h6">Half Width (6 columns)</Typography>
          </Paper>
        </Box>
        
        {/* One-third width items */}
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
          <Paper sx={{ p: 3, bgcolor: '#b2ebf2', height: '100%' }}>
            <Typography variant="h6">One-Third (4 columns)</Typography>
          </Paper>
        </Box>
        
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
          <Paper sx={{ p: 3, bgcolor: '#b2ebf2', height: '100%' }}>
            <Typography variant="h6">One-Third (4 columns)</Typography>
          </Paper>
        </Box>
        
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 4' } }}>
          <Paper sx={{ p: 3, bgcolor: '#b2ebf2', height: '100%' }}>
            <Typography variant="h6">One-Third (4 columns)</Typography>
          </Paper>
        </Box>
        
        {/* One-quarter width items */}
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Paper sx={{ p: 3, bgcolor: '#c8e6c9', height: '100%' }}>
            <Typography variant="h6">Quarter (3 columns)</Typography>
          </Paper>
        </Box>
        
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Paper sx={{ p: 3, bgcolor: '#c8e6c9', height: '100%' }}>
            <Typography variant="h6">Quarter (3 columns)</Typography>
          </Paper>
        </Box>
        
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Paper sx={{ p: 3, bgcolor: '#c8e6c9', height: '100%' }}>
            <Typography variant="h6">Quarter (3 columns)</Typography>
          </Paper>
        </Box>
        
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
          <Paper sx={{ p: 3, bgcolor: '#c8e6c9', height: '100%' }}>
            <Typography variant="h6">Quarter (3 columns)</Typography>
          </Paper>
        </Box>
      </Box>
    </ResponsiveContainer>
  ),
};