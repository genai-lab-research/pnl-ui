import type { Meta, StoryObj } from '@storybook/react';
import { DeviceThermostat, WaterDrop, Air, Speed } from '@mui/icons-material';
import { Box } from '@mui/material';
import { KPIMonitorCard } from './KPIMonitorCard';

const meta: Meta<typeof KPIMonitorCard> = {
  title: 'UI Components/KPIMonitorCard',
  component: KPIMonitorCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A reusable component for displaying KPI metrics with icons and values. Perfect for dashboards, control panels, or metric displays.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Metric or section title',
    },
    value: {
      control: 'text',
      description: 'Primary current value',
    },
    targetValue: {
      control: 'text',
      description: 'Target or comparison value',
    },
    unit: {
      control: 'text',
      description: 'Value unit (e.g., "°C", "%", "kg/ha")',
    },
    subtitle: {
      control: 'text',
      description: 'Optional supporting label',
    },
    delta: {
      control: 'text',
      description: 'Change since previous period',
    },
    deltaDirection: {
      control: 'select',
      options: ['up', 'down', 'flat'],
      description: 'Trend direction for visuals/colors',
    },
    iconName: {
      control: 'select',
      options: ['thermostat', 'water', 'air', 'speed'],
      description: 'Icon identifier',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'outlined', 'elevated'],
      description: 'Visual variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size scale',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with skeletons',
    },
    error: {
      control: 'text',
      description: 'Error state message',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof KPIMonitorCard>;

// Default story - Air Temperature (matches the original design)
export const Default: Story = {
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    iconName: 'thermostat',
    variant: 'default',
    size: 'md',
  },
};

// Humidity monitoring
export const Humidity: Story = {
  args: {
    title: 'Humidity Level',
    value: '65',
    targetValue: '70',
    unit: '%',
    iconSlot: <WaterDrop />,
    variant: 'default',
    size: 'md',
  },
};

// Air Quality with delta
export const AirQuality: Story = {
  args: {
    title: 'Air Quality Index',
    value: '42',
    unit: ' AQI',
    delta: '+3',
    deltaDirection: 'up',
    iconSlot: <Air />,
    variant: 'default',
    size: 'md',
  },
};

// Performance metric
export const Performance: Story = {
  args: {
    title: 'System Performance',
    value: '98.5',
    unit: '%',
    subtitle: 'Last 24 hours',
    delta: '+0.3%',
    deltaDirection: 'up',
    iconSlot: <Speed />,
    variant: 'elevated',
    size: 'md',
  },
};

// Size variations
export const SizeSmall: Story = {
  args: {
    title: 'Temperature',
    value: '20°C',
    targetValue: '21°C',
    iconName: 'thermostat',
    size: 'sm',
  },
};

export const SizeLarge: Story = {
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    iconName: 'thermostat',
    size: 'lg',
  },
};

// Variant demonstrations
export const VariantCompact: Story = {
  args: {
    title: 'Temperature',
    value: '20°C',
    targetValue: '21°C',
    iconName: 'thermostat',
    variant: 'compact',
  },
};

export const VariantOutlined: Story = {
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    iconName: 'thermostat',
    variant: 'outlined',
  },
};

export const VariantElevated: Story = {
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    iconName: 'thermostat',
    variant: 'elevated',
  },
};

// State variations
export const Loading: Story = {
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    iconName: 'thermostat',
    loading: true,
  },
};

export const Error: Story = {
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    iconName: 'thermostat',
    error: 'Failed to load sensor data',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    iconName: 'thermostat',
    disabled: true,
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    iconName: 'thermostat',
    onClick: () => alert('Temperature sensor clicked!'),
  },
};

// Grid of different metrics
export const Dashboard: Story = {
  render: () => (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: 2,
      maxWidth: '800px'
    }}>
      <KPIMonitorCard
        title="Air Temperature"
        value="20°C"
        targetValue="21°C"
        iconName="thermostat"
      />
      <KPIMonitorCard
        title="Humidity Level"
        value="65"
        targetValue="70"
        unit="%"
        iconSlot={<WaterDrop />}
      />
      <KPIMonitorCard
        title="Air Quality"
        value="42"
        unit=" AQI"
        delta="+3"
        deltaDirection="up"
        iconSlot={<Air />}
      />
      <KPIMonitorCard
        title="System Performance"
        value="98.5"
        unit="%"
        delta="+0.3%"
        deltaDirection="up"
        iconSlot={<Speed />}
        variant="elevated"
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple KPI monitor cards used together in a dashboard layout.',
      },
    },
  },
};

// With footer slot
export const WithFooter: Story = {
  args: {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    iconName: 'thermostat',
    footerSlot: (
      <Box sx={{ fontSize: '10px', color: '#6B7280', textAlign: 'center' }}>
        Last updated: 2 min ago
      </Box>
    ),
  },
};
