import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'UI/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    format: {
      control: 'select',
      options: ['default', 'temperature', 'percentage', 'co2', 'weight'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Temperature: Story = {
  args: {
    label: 'Air Temperature',
    value: 20,
    format: 'temperature',
  },
};

export const Humidity: Story = {
  args: {
    label: 'Rel. Humidity',
    value: 65,
    format: 'percentage',
  },
};

export const CO2Level: Story = {
  args: {
    label: 'CO₂ Level',
    value: 860,
    format: 'co2',
  },
};

export const Yield: Story = {
  args: {
    label: 'Yield',
    value: 51,
    format: 'weight',
    trend: 5.2,
  },
};

export const Utilization: Story = {
  args: {
    label: 'Nursery Station Utilization',
    value: 75,
    format: 'percentage',
  },
};

export const WithTrend: Story = {
  args: {
    label: 'Cultivation Area Utilization',
    value: 90,
    format: 'percentage',
    trend: -2.1,
  },
};