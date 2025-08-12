import type { Meta, StoryObj } from '@storybook/react';
import KPIStatCard from './KPIStatCard';

const meta = {
  title: 'Shared/KPIStatCard',
  component: KPIStatCard,
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
    deltaDirection: {
      control: { type: 'radio' },
      options: ['up', 'down', 'flat'],
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof KPIStatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Monthly Revenue',
    value: 42500,
    unit: '$',
    delta: 12.5,
    deltaDirection: 'up',
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Temperature',
    value: 23.4,
    unit: '°C',
    subtitle: 'Current reading',
    delta: 2.1,
    deltaDirection: 'up',
  },
};

export const Compact: Story = {
  args: {
    title: 'Active Users',
    value: '1,234',
    variant: 'compact',
    delta: -5.2,
    deltaDirection: 'down',
  },
};

export const Outlined: Story = {
  args: {
    title: 'Conversion Rate',
    value: 3.2,
    unit: '%',
    variant: 'outlined',
    delta: 0.8,
    deltaDirection: 'up',
  },
};

export const Elevated: Story = {
  args: {
    title: 'Orders Today',
    value: 156,
    variant: 'elevated',
    delta: 23,
    deltaDirection: 'up',
  },
};

export const Small: Story = {
  args: {
    title: 'CPU Usage',
    value: 67,
    unit: '%',
    size: 'sm',
    delta: -3,
    deltaDirection: 'down',
  },
};

export const Large: Story = {
  args: {
    title: 'Total Sales',
    value: 987654,
    unit: '$',
    size: 'lg',
    delta: 15.7,
    deltaDirection: 'up',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Storage Used',
    value: 4.2,
    unit: 'GB',
    iconName: 'storage',
    delta: 0.3,
    deltaDirection: 'up',
  },
};

export const NoChange: Story = {
  args: {
    title: 'Stable Metric',
    value: 100,
    unit: '%',
    delta: 0,
    deltaDirection: 'flat',
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Data',
    loading: true,
  },
};

export const Error: Story = {
  args: {
    title: 'Failed Metric',
    error: 'Failed to load data',
  },
};

export const Interactive: Story = {
  args: {
    title: 'Click Me',
    value: 42,
    unit: 'clicks',
    onClick: () => alert('Card clicked!'),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '600px' }}>
      <KPIStatCard
        title="Default"
        value={1234}
        unit="$"
        delta={5.2}
        deltaDirection="up"
        variant="default"
      />
      <KPIStatCard
        title="Compact"
        value={567}
        unit="€"
        delta={-2.1}
        deltaDirection="down"
        variant="compact"
      />
      <KPIStatCard
        title="Outlined"
        value={89}
        unit="%"
        delta={1.5}
        deltaDirection="up"
        variant="outlined"
      />
      <KPIStatCard
        title="Elevated"
        value={456}
        unit="kg"
        delta={0}
        deltaDirection="flat"
        variant="elevated"
      />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <KPIStatCard
        title="Small"
        value={123}
        unit="$"
        size="sm"
        delta={2.3}
        deltaDirection="up"
      />
      <KPIStatCard
        title="Medium"
        value={456}
        unit="€"
        size="md"
        delta={-1.2}
        deltaDirection="down"
      />
      <KPIStatCard
        title="Large"
        value={789}
        unit="£"
        size="lg"
        delta={0.5}
        deltaDirection="up"
      />
    </div>
  ),
};