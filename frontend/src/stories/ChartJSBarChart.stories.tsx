import type { Meta, StoryObj } from '@storybook/react';
import { ChartJSBarChart } from '../shared/components/ui/ChartJS/ChartJSBarChart';

const meta: Meta<typeof ChartJSBarChart> = {
  title: 'Components/ChartJSBarChart',
  component: ChartJSBarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    mutedColor: { control: 'color' },
    maxHeight: { control: { type: 'range', min: 50, max: 300, step: 10 } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const weeklyData = [
  { day: 'Mon', value: 120 },
  { day: 'Tue', value: 190 },
  { day: 'Wed', value: 30 },
  { day: 'Thu', value: 50 },
  { day: 'Fri', value: 200 },
  { day: 'Sat', value: 30 },
  { day: 'Sun', value: 90 },
];

export const YieldChart: Story = {
  args: {
    data: weeklyData,
    color: '#4CAF50',
    mutedColor: '#EAEEF6',
    maxHeight: 100,
  },
};

export const SpaceUtilizationChart: Story = {
  args: {
    data: weeklyData.map(d => ({ ...d, value: Math.min(d.value, 100) })),
    color: '#2196F3',
    mutedColor: '#EAEEF6',
    maxHeight: 100,
  },
};

export const CustomStyling: Story = {
  args: {
    data: weeklyData,
    color: '#FF6B6B',
    mutedColor: '#FFE0E0',
    maxHeight: 150,
    className: 'custom-chart',
  },
};

export const WithCurrentDay: Story = {
  args: {
    data: weeklyData.map((d, i) => ({
      ...d,
      isCurrent: i === 4, // Friday is current
    })),
    color: '#9C27B0',
    mutedColor: '#F3E5F5',
    maxHeight: 120,
  },
};

export const LowValues: Story = {
  args: {
    data: [
      { day: 'Mon', value: 2 },
      { day: 'Tue', value: 5 },
      { day: 'Wed', value: 0 },
      { day: 'Thu', value: 1 },
      { day: 'Fri', value: 8 },
      { day: 'Sat', value: 0 },
      { day: 'Sun', value: 3 },
    ],
    color: '#FF9800',
    mutedColor: '#FFF3E0',
    maxHeight: 80,
  },
};