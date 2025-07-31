import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from '../shared/components/ui/MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'Components/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'select',
      options: ['Physical Containers', 'Virtual Containers'],
    },
    containerCount: { control: 'number' },
    isLoading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleChartData = [
  { day: 'Mon', value: 120, isCurrent: false },
  { day: 'Tue', value: 190, isCurrent: false },
  { day: 'Wed', value: 30, isCurrent: false },
  { day: 'Thu', value: 50, isCurrent: false },
  { day: 'Fri', value: 200, isCurrent: true },
  { day: 'Sat', value: 30, isCurrent: false },
  { day: 'Sun', value: 90, isCurrent: false },
];

const sampleSpaceData = [
  { day: 'Mon', value: 65, isCurrent: false },
  { day: 'Tue', value: 80, isCurrent: false },
  { day: 'Wed', value: 45, isCurrent: false },
  { day: 'Thu', value: 72, isCurrent: false },
  { day: 'Fri', value: 88, isCurrent: true },
  { day: 'Sat', value: 55, isCurrent: false },
  { day: 'Sun', value: 70, isCurrent: false },
];

export const PhysicalContainers: Story = {
  args: {
    title: 'Physical Containers',
    containerCount: 24,
    yieldData: {
      average: 125,
      total: 875,
      unit: 'KG',
      chartData: sampleChartData,
    },
    spaceUtilizationData: {
      average: 68,
      unit: '%',
      chartData: sampleSpaceData,
    },
    isLoading: false,
  },
};

export const VirtualContainers: Story = {
  args: {
    title: 'Virtual Containers',
    containerCount: 18,
    yieldData: {
      average: 98,
      total: 686,
      unit: 'KG',
      chartData: sampleChartData.map(d => ({ ...d, value: Math.round(d.value * 0.8) })),
    },
    spaceUtilizationData: {
      average: 72,
      unit: '%',
      chartData: sampleSpaceData.map(d => ({ ...d, value: Math.min(d.value + 10, 100) })),
    },
    isLoading: false,
  },
};

export const LoadingState: Story = {
  args: {
    title: 'Physical Containers',
    containerCount: 0,
    yieldData: {
      average: 0,
      total: 0,
      unit: 'KG',
      chartData: [],
    },
    spaceUtilizationData: {
      average: 0,
      unit: '%',
      chartData: [],
    },
    isLoading: true,
  },
};

export const WithClickHandler: Story = {
  args: {
    title: 'Virtual Containers',
    containerCount: 12,
    yieldData: {
      average: 156,
      total: 1092,
      unit: 'KG',
      chartData: sampleChartData,
    },
    spaceUtilizationData: {
      average: 85,
      unit: '%',
      chartData: sampleSpaceData,
    },
    isLoading: false,
    onClick: () => alert('Virtual containers clicked!'),
  },
};

export const NoTotal: Story = {
  args: {
    title: 'Physical Containers',
    containerCount: 8,
    yieldData: {
      average: 76,
      unit: 'KG',
      chartData: sampleChartData.map(d => ({ ...d, value: Math.round(d.value * 0.6) })),
    },
    spaceUtilizationData: {
      average: 52,
      unit: '%',
      chartData: sampleSpaceData.map(d => ({ ...d, value: Math.round(d.value * 0.7) })),
    },
    isLoading: false,
  },
};