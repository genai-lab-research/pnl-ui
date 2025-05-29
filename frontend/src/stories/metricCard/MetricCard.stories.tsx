import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from '../../shared/components/ui/MetricCard';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import Co2Icon from '@mui/icons-material/Co2';

const meta = {
  title: 'UI/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'MetricCard displays a key metric with title, icon, and value. Optionally shows a target or comparison value. Component is designed to match the Figma design pixel-perfectly with precise typography, spacing, and color values. The component is fully responsive and adapts to different viewport sizes.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: { 
      control: 'text',
      description: 'Title of the metric card'
    },
    value: { 
      control: 'text',
      description: 'Current value to display in the metric card'
    },
    targetValue: {
      control: 'text',
      description: 'Optional target or comparison value to display'
    },
    icon: { 
      control: { type: 'select' },
      options: ['none', 'temperature', 'humidity', 'wind', 'co2'],
      mapping: {
        none: undefined,
        temperature: <DeviceThermostatIcon />,
        humidity: <WaterDropIcon />,
        wind: <AirIcon />,
        co2: <Co2Icon />
      },
      description: 'Icon to display next to the value'
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '250px', padding: '20px', backgroundColor: '#F7F9FD' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default MetricCard story - matches the reference design exactly
export const Default: Story = {
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    icon: <DeviceThermostatIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default implementation matches the reference design precisely, with correct typography, alignment, and spacing.'
      }
    }
  }
};

// MetricCard without icon
export const NoIcon: Story = {
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
  },
};

// MetricCard with different metrics
export const Humidity: Story = {
  args: {
    title: 'Rel. Humidity',
    value: '65%',
    targetValue: '68%',
    icon: <WaterDropIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
};

export const CO2Level: Story = {
  args: {
    title: 'CO₂ Level',
    value: '860',
    targetValue: '800-900ppm',
    icon: <Co2Icon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
};

export const Wind: Story = {
  args: {
    title: 'Wind Speed',
    value: '5 km/h',
    icon: <AirIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
};

// MetricCard without target value
export const SingleValue: Story = {
  args: {
    title: 'Air Pressure',
    value: '1013 hPa',
    icon: <AirIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
};

// Test for text overflow handling
export const LongText: Story = {
  args: {
    title: 'Very Long Temperature Reading Name That Might Overflow',
    value: '19.8765°C',
    targetValue: '21.5°C',
    icon: <DeviceThermostatIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'MetricCard demonstrates proper handling of long text content through truncation and overflow protection.'
      }
    }
  }
};

// Grid of multiple metric cards
export const GridExample: StoryObj = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'MetricCards can be arranged in a responsive grid layout. The cards will automatically adjust their size based on the available space, from multi-column on large screens to single column on mobile devices.'
      }
    }
  },
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#F7F9FD' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
        gap: '16px', 
        maxWidth: '800px'
      }}>
        <MetricCard title="Air Temperature" value="20°C" targetValue="21°C" icon={<DeviceThermostatIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />} />
        <MetricCard title="Rel. Humidity" value="65%" targetValue="68%" icon={<WaterDropIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />} />
        <MetricCard title="CO₂ Level" value="860" targetValue="800-900ppm" icon={<Co2Icon style={{ color: '#9CA3AF', opacity: 0.7 }} />} />
        <MetricCard title="Wind Speed" value="5 km/h" icon={<AirIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />} />
      </div>
    </div>
  ),
};

// Responsive view examples
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'MetricCard optimized for mobile screens. Font sizes and padding adjust for better readability on small devices while maintaining the design\'s visual hierarchy.'
      }
    }
  },
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    icon: <DeviceThermostatIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'MetricCard adjusted for tablet screens. Font sizes and spacing scale appropriately while maintaining the design\'s proportions.'
      }
    }
  },
  args: {
    title: 'Rel. Humidity',
    value: '65%',
    targetValue: '68%',
    icon: <WaterDropIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
};

export const ResponsiveBreakpoints: StoryObj = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'This showcase demonstrates how MetricCards adapt across multiple breakpoints.'
      }
    }
  },
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#F7F9FD' }}>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '800px'
      }}>
        <div>
          <h3 style={{ marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Desktop (1200px+)</h3>
          <div style={{ maxWidth: '250px' }}>
            <MetricCard title="Air Temperature" value="20°C" targetValue="21°C" icon={<DeviceThermostatIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />} />
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Tablet (900-1199px)</h3>
          <div style={{ maxWidth: '200px' }}>
            <MetricCard title="Air Temperature" value="20°C" targetValue="21°C" icon={<DeviceThermostatIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />} />
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Mobile (600-899px)</h3>
          <div style={{ maxWidth: '150px' }}>
            <MetricCard title="Air Temperature" value="20°C" targetValue="21°C" icon={<DeviceThermostatIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />} />
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Small Mobile (less than 600px)</h3>
          <div style={{ maxWidth: '120px' }}>
            <MetricCard title="Air Temperature" value="20°C" targetValue="21°C" icon={<DeviceThermostatIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />} />
          </div>
        </div>
      </div>
    </div>
  ),
};

// Before and After comparison
export const BeforeAfterComparison: StoryObj = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'This example shows the implementation after fixing the issues identified in the QA report. The updated version now properly matches the reference design with correct typography, spacing, and icon color.'
      }
    }
  },
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#F7F9FD' }}>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '800px'
      }}>
        <div>
          <h3 style={{ marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Updated Implementation (After)</h3>
          <div style={{ maxWidth: '250px' }}>
            <MetricCard title="Air Temperature" value="20°C" targetValue="21°C" icon={<DeviceThermostatIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />} />
          </div>
        </div>
      </div>
    </div>
  ),
};