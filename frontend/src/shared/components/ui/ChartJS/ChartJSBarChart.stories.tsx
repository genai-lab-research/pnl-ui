import type { Meta, StoryObj } from '@storybook/react';
import { ChartJSBarChart } from './ChartJSBarChart';
import type { ChartDataPoint } from './types';

const meta = {
  title: 'UI/ChartJSBarChart',
  component: ChartJSBarChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A compact bar chart component built with Chart.js for displaying weekly data trends.

## Features
- Weekly data visualization with 7-day view
- Customizable bar colors for active/inactive states
- Responsive design with configurable max height
- Hover tooltips showing day and value
- Clean, minimal design perfect for dashboards
- Support for highlighting current day

## Usage
Ideal for displaying weekly metrics, activity patterns, or any time-series data that spans a week.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: { type: 'object' },
      description: 'Array of chart data points with day and value',
    },
    color: {
      control: { type: 'color' },
      description: 'Primary color for active bars',
    },
    mutedColor: {
      control: { type: 'color' },
      description: 'Color for inactive/zero value bars',
    },
    maxHeight: {
      control: { type: 'number' },
      description: 'Maximum height of the chart in pixels',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ChartJSBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to generate sample data
const generateWeekData = (pattern: 'ascending' | 'descending' | 'random' | 'peak'): ChartDataPoint[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return days.map((day, index) => {
    let value = 0;
    
    switch (pattern) {
      case 'ascending':
        value = (index + 1) * 10;
        break;
      case 'descending':
        value = (7 - index) * 10;
        break;
      case 'random':
        value = Math.floor(Math.random() * 100);
        break;
      case 'peak':
        // Peak on Wednesday
        value = index === 3 ? 90 : 30 + Math.floor(Math.random() * 20);
        break;
    }
    
    return {
      day,
      value,
      isCurrent: index === new Date().getDay() - 1,
    };
  });
};

// Default story with typical weekly data
export const Default: Story = {
  args: {
    data: [
      { day: 'Mon', value: 65 },
      { day: 'Tue', value: 45 },
      { day: 'Wed', value: 80 },
      { day: 'Thu', value: 70 },
      { day: 'Fri', value: 55 },
      { day: 'Sat', value: 30 },
      { day: 'Sun', value: 25 },
    ],
    color: '#10B981',
  },
};

// Activity tracking example
export const ActivityTracking: Story = {
  args: {
    data: [
      { day: 'Mon', value: 8 },
      { day: 'Tue', value: 12 },
      { day: 'Wed', value: 15 },
      { day: 'Thu', value: 10 },
      { day: 'Fri', value: 18 },
      { day: 'Sat', value: 5 },
      { day: 'Sun', value: 3 },
    ],
    color: '#3B82F6',
    maxHeight: 80,
  },
};

// Performance metrics with custom colors
export const PerformanceMetrics: Story = {
  args: {
    data: generateWeekData('peak'),
    color: '#8B5CF6',
    mutedColor: '#E5E7EB',
  },
};

// Minimal data with some zero values
export const SparseData: Story = {
  args: {
    data: [
      { day: 'Mon', value: 0 },
      { day: 'Tue', value: 25 },
      { day: 'Wed', value: 0 },
      { day: 'Thu', value: 45 },
      { day: 'Fri', value: 60 },
      { day: 'Sat', value: 0 },
      { day: 'Sun', value: 0 },
    ],
    color: '#EF4444',
  },
};

// High values chart
export const HighValues: Story = {
  args: {
    data: [
      { day: 'Mon', value: 850 },
      { day: 'Tue', value: 920 },
      { day: 'Wed', value: 1100 },
      { day: 'Thu', value: 980 },
      { day: 'Fri', value: 1250 },
      { day: 'Sat', value: 750 },
      { day: 'Sun', value: 600 },
    ],
    color: '#F59E0B',
    maxHeight: 120,
  },
};

// Ascending trend
export const AscendingTrend: Story = {
  args: {
    data: generateWeekData('ascending'),
    color: '#10B981',
  },
};

// Descending trend
export const DescendingTrend: Story = {
  args: {
    data: generateWeekData('descending'),
    color: '#EF4444',
  },
};

// Custom styling example
export const CustomStyling: Story = {
  args: {
    data: [
      { day: 'Mon', value: 40 },
      { day: 'Tue', value: 65 },
      { day: 'Wed', value: 55 },
      { day: 'Thu', value: 70 },
      { day: 'Fri', value: 85 },
      { day: 'Sat', value: 45 },
      { day: 'Sun', value: 30 },
    ],
    color: '#EC4899',
    mutedColor: '#FEE2E2',
    className: 'p-4 bg-gray-50 rounded-lg shadow-sm',
  },
};

// All zero values (empty state)
export const EmptyState: Story = {
  args: {
    data: [
      { day: 'Mon', value: 0 },
      { day: 'Tue', value: 0 },
      { day: 'Wed', value: 0 },
      { day: 'Thu', value: 0 },
      { day: 'Fri', value: 0 },
      { day: 'Sat', value: 0 },
      { day: 'Sun', value: 0 },
    ],
    color: '#6B7280',
  },
};

// Compact size
export const CompactSize: Story = {
  args: {
    data: generateWeekData('random'),
    color: '#06B6D4',
    maxHeight: 50,
  },
};