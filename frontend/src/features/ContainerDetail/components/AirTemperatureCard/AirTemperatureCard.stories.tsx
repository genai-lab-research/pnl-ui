import type { Meta, StoryObj } from '@storybook/react';
import { AirTemperatureCard } from './AirTemperatureCard';

const meta = {
  title: 'Features/ContainerDetail/AirTemperatureCard',
  component: AirTemperatureCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Domain-specific component for displaying air temperature metrics in vertical farming containers.

## Features
- Built on top of TemperatureMetricCard
- Specialized for air temperature monitoring
- Shows current and target temperature
- Includes thermometer icon
- Consistent with container metrics design
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    unit: {
      control: { type: 'select' },
      options: ['°C', '°F', 'K'],
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof AirTemperatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentTemperature: 20,
  },
};

export const WithTarget: Story = {
  args: {
    currentTemperature: 20,
    targetTemperature: 21,
  },
};

export const Fahrenheit: Story = {
  args: {
    currentTemperature: 68,
    targetTemperature: 70,
    unit: '°F',
  },
};

export const HighTemperature: Story = {
  args: {
    currentTemperature: 28,
    targetTemperature: 22,
  },
};

export const LowTemperature: Story = {
  args: {
    currentTemperature: 15,
    targetTemperature: 20,
  },
};

export const Loading: Story = {
  args: {
    currentTemperature: 20,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    currentTemperature: 20,
    error: 'Temperature sensor disconnected',
  },
};

export const Interactive: Story = {
  args: {
    currentTemperature: 22,
    targetTemperature: 23,
    onClick: () => alert('Air temperature card clicked!'),
  },
};

export const RealWorldExample: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    }}>
      <AirTemperatureCard
        currentTemperature={20}
        targetTemperature={21}
      />
      <AirTemperatureCard
        currentTemperature={24}
        targetTemperature={22}
      />
      <AirTemperatureCard
        currentTemperature={18}
        targetTemperature={20}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple air temperature cards as they would appear in a metrics dashboard.',
      },
    },
  },
};