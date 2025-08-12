import type { Meta, StoryObj } from '@storybook/react';
import { MetricsDashboard } from './MetricsDashboard';
import { DashboardMetrics } from '../../../../api/containerApiService';

const meta = {
  title: 'Features/ContainerDetail/MetricsDashboard',
  component: MetricsDashboard,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    timePeriod: {
      control: { type: 'radio' },
      options: ['week', 'month', 'quarter', 'year'],
    },
  },
} satisfies Meta<typeof MetricsDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockMetrics: DashboardMetrics = {
  air_temperature: 22.5,
  humidity: 65,
  co2: 850,
  yield: {
    average: 12.5,
    total: 150,
    chart_data: [
      { date: '2024-01-01', value: 10, is_current_period: false, is_future: false },
      { date: '2024-01-02', value: 11, is_current_period: false, is_future: false },
      { date: '2024-01-03', value: 12, is_current_period: true, is_future: false },
      { date: '2024-01-04', value: 13, is_current_period: true, is_future: false },
      { date: '2024-01-05', value: 14, is_current_period: true, is_future: true },
    ],
  },
  space_utilization: {
    nursery_station: 75,
    cultivation_area: 82,
    chart_data: [
      { date: '2024-01-01', nursery_value: 70, cultivation_value: 80, is_current_period: false, is_future: false },
      { date: '2024-01-02', nursery_value: 72, cultivation_value: 81, is_current_period: false, is_future: false },
      { date: '2024-01-03', nursery_value: 75, cultivation_value: 82, is_current_period: true, is_future: false },
    ],
  },
};

export const Default: Story = {
  args: {
    metrics: mockMetrics,
    timePeriod: 'week',
    onTimePeriodChange: (period) => console.log('Time period changed to:', period),
  },
};

export const MonthView: Story = {
  args: {
    metrics: mockMetrics,
    timePeriod: 'month',
    onTimePeriodChange: (period) => console.log('Time period changed to:', period),
  },
};

export const Loading: Story = {
  args: {
    metrics: null as any,
    timePeriod: 'week',
    onTimePeriodChange: (period) => console.log('Time period changed to:', period),
  },
};