import type { Meta, StoryObj } from '@storybook/react';

import { StatContainer } from '../../shared/components/ui/Container';

const meta = {
  title: 'Container/StatContainer',
  component: StatContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StatContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for the charts
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const yieldData = weekDays.map((day, index) => ({
  day,
  value: 30 + Math.floor(Math.random() * 40),
}));

const utilizationData = weekDays.map((day, index) => ({
  day,
  value: 60 + Math.floor(Math.random() * 30),
}));

export const Default: Story = {
  args: {
    title: 'Physical Containers',
    value: '4',
    leftChartTitle: 'YIELD',
    rightChartTitle: 'SPACE UTILIZATION',
    leftAverage: '63KG',
    leftTotal: '81KG',
    rightAverage: '80%',
    leftChartData: yieldData,
    rightChartData: utilizationData,
  },
};

export const SingleChart: Story = {
  args: {
    title: 'Virtual Farms',
    value: '7',
    leftChartTitle: 'UPTIME',
    leftAverage: '98.7%',
    leftChartData: weekDays.map((day, index) => ({
      day,
      value: 90 + Math.floor(Math.random() * 10),
    })),
  },
};

export const NoCharts: Story = {
  args: {
    title: 'Total Alerts',
    value: '12',
  },
};
