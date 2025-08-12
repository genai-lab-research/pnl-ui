import type { Meta, StoryObj } from '@storybook/react';
import TemperatureMetricCard from './TemperatureMetricCard';

const meta = {
  title: 'Shared/TemperatureMetricCard',
  component: TemperatureMetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['default', 'compact', 'outlined', 'elevated'],
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    unit: {
      control: { type: 'select' },
      options: ['°C', '°F', 'K'],
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof TemperatureMetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Room Temperature',
    currentValue: 22.5,
    unit: '°C',
  },
};

export const WithTargetValue: Story = {
  args: {
    title: 'Thermostat Setting',
    currentValue: 23.2,
    targetValue: 24.0,
    unit: '°C',
  },
};

export const Fahrenheit: Story = {
  args: {
    title: 'Outside Temperature',
    currentValue: 75.4,
    unit: '°F',
  },
};

export const Kelvin: Story = {
  args: {
    title: 'Scientific Reading',
    currentValue: 295.65,
    unit: 'K',
  },
};

export const Compact: Story = {
  args: {
    title: 'CPU Temp',
    currentValue: 45,
    unit: '°C',
    variant: 'compact',
  },
};

export const Outlined: Story = {
  args: {
    title: 'Water Temperature',
    currentValue: 18.7,
    targetValue: 20.0,
    unit: '°C',
    variant: 'outlined',
  },
};

export const Elevated: Story = {
  args: {
    title: 'Greenhouse',
    currentValue: 26.8,
    targetValue: 25.0,
    unit: '°C',
    variant: 'elevated',
  },
};

export const Small: Story = {
  args: {
    title: 'Sensor 1',
    currentValue: 19.2,
    unit: '°C',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    title: 'Main Temperature',
    currentValue: 21.8,
    targetValue: 22.0,
    unit: '°C',
    size: 'lg',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Air Temperature',
    currentValue: 24.1,
    unit: '°C',
    iconName: 'thermometer',
  },
};

export const FreezingPoint: Story = {
  args: {
    title: 'Freezer',
    currentValue: -18,
    unit: '°C',
  },
};

export const HighTemperature: Story = {
  args: {
    title: 'Oven Temperature',
    currentValue: 180,
    unit: '°C',
    targetValue: 200,
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Temperature',
    currentValue: 0,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    title: 'Sensor Error',
    currentValue: 0,
    error: 'Sensor disconnected',
  },
};

export const Interactive: Story = {
  args: {
    title: 'Clickable Sensor',
    currentValue: 22.3,
    unit: '°C',
    onClick: () => alert('Temperature sensor clicked!'),
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Smart Thermostat',
    currentValue: 21.5,
    targetValue: 22.0,
    unit: '°C',
    footerSlot: (
      <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
        Last updated: 2 minutes ago
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '600px' }}>
      <TemperatureMetricCard
        title="Default"
        currentValue={22.5}
        targetValue={23.0}
        unit="°C"
        variant="default"
      />
      <TemperatureMetricCard
        title="Compact"
        currentValue={18.2}
        unit="°C"
        variant="compact"
      />
      <TemperatureMetricCard
        title="Outlined"
        currentValue={25.7}
        targetValue={26.0}
        unit="°C"
        variant="outlined"
      />
      <TemperatureMetricCard
        title="Elevated"
        currentValue={20.1}
        unit="°C"
        variant="elevated"
      />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <TemperatureMetricCard
        title="Small"
        currentValue={19.5}
        unit="°C"
        size="sm"
      />
      <TemperatureMetricCard
        title="Medium"
        currentValue={22.0}
        targetValue={23.0}
        unit="°C"
        size="md"
      />
      <TemperatureMetricCard
        title="Large"
        currentValue={24.8}
        targetValue={25.0}
        unit="°C"
        size="lg"
      />
    </div>
  ),
};

export const TemperatureUnits: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <TemperatureMetricCard
        title="Celsius"
        currentValue={22.5}
        unit="°C"
      />
      <TemperatureMetricCard
        title="Fahrenheit"
        currentValue={72.5}
        unit="°F"
      />
      <TemperatureMetricCard
        title="Kelvin"
        currentValue={295.65}
        unit="K"
      />
    </div>
  ),
};