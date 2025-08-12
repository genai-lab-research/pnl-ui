import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ContainerStatsCard from './ContainerStatsCard';
import { ChartConfig } from './types';

const meta = {
  title: 'UI/ContainerStatsCard',
  component: ContainerStatsCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A versatile card component for displaying container statistics with mini bar charts.

## Features
- Multiple metrics display with individual bar charts
- Responsive design that adapts to different screen sizes
- Multiple visual variants (default, compact, outlined, elevated)
- Three size options (sm, md, lg)
- Loading and error states with appropriate feedback
- Accessibility support with proper ARIA labels
- Interactive support with click handler and keyboard navigation
- Custom footer slot for additional actions or legends

## Usage
Perfect for dashboards, analytics views, and data visualization scenarios where you need to display multiple related metrics in a compact, visually appealing format.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Main title for the statistics card',
    },
    totalCount: {
      control: { type: 'text' },
      description: 'Total count displayed in the badge',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'outlined', 'elevated'],
      description: 'Visual variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size scale',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ContainerStatsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample chart data
const temperatureData: ChartConfig = {
  title: 'Temperature',
  avgLabel: 'Avg',
  avgValue: '23°C',
  totalLabel: 'Total Range',
  totalValue: '18-28°C',
  color: '#3B82F6',
  data: [
    { label: 'Mon', value: 22 },
    { label: 'Tue', value: 23 },
    { label: 'Wed', value: 24, isActive: true },
    { label: 'Thu', value: 23 },
    { label: 'Fri', value: 25 },
    { label: 'Sat', value: 24 },
    { label: 'Sun', value: 23 },
  ],
};

const humidityData: ChartConfig = {
  title: 'Humidity',
  avgLabel: 'Avg',
  avgValue: '68%',
  color: '#10B981',
  data: [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 68 },
    { label: 'Wed', value: 70, isActive: true },
    { label: 'Thu', value: 67 },
    { label: 'Fri', value: 69 },
    { label: 'Sat', value: 66 },
    { label: 'Sun', value: 68 },
  ],
};

const co2Data: ChartConfig = {
  title: 'CO2 Levels',
  avgLabel: 'Avg',
  avgValue: '420 ppm',
  color: '#F59E0B',
  data: [
    { label: 'Mon', value: 410 },
    { label: 'Tue', value: 415 },
    { label: 'Wed', value: 425, isActive: true },
    { label: 'Thu', value: 420 },
    { label: 'Fri', value: 430 },
    { label: 'Sat', value: 418 },
    { label: 'Sun', value: 422 },
  ],
};

// Default story with multiple charts
export const Default: Story = {
  args: {
    title: 'Container Statistics',
    totalCount: 42,
    charts: [temperatureData, humidityData],
    ariaLabel: 'Container statistics overview',
  },
};

// Three charts example
export const MultipleCharts: Story = {
  args: {
    title: 'Environmental Metrics',
    totalCount: '3 Active',
    charts: [temperatureData, humidityData, co2Data],
    ariaLabel: 'Environmental metrics dashboard',
  },
};

// Single chart
export const SingleChart: Story = {
  args: {
    title: 'Temperature Monitor',
    totalCount: 1,
    charts: [temperatureData],
    ariaLabel: 'Temperature monitoring card',
  },
};

// Loading state
export const Loading: Story = {
  args: {
    title: 'Loading Statistics',
    loading: true,
    charts: [],
    ariaLabel: 'Loading statistics',
  },
};

// Error state
export const Error: Story = {
  args: {
    title: 'Statistics',
    error: 'Failed to load statistics. Please try again.',
    charts: [],
    ariaLabel: 'Statistics error',
  },
};

// Size variations
export const SmallSize: Story = {
  args: {
    title: 'Small Card',
    totalCount: 15,
    charts: [temperatureData],
    size: 'sm',
    ariaLabel: 'Small statistics card',
  },
};

export const LargeSize: Story = {
  args: {
    title: 'Large Card',
    totalCount: 85,
    charts: [temperatureData, humidityData],
    size: 'lg',
    ariaLabel: 'Large statistics card',
  },
};

// Variant examples
export const CompactVariant: Story = {
  args: {
    title: 'Compact Stats',
    totalCount: 24,
    charts: [temperatureData, humidityData],
    variant: 'compact',
    ariaLabel: 'Compact statistics display',
  },
};

export const OutlinedVariant: Story = {
  args: {
    title: 'Outlined Stats',
    totalCount: 36,
    charts: [temperatureData, humidityData],
    variant: 'outlined',
    ariaLabel: 'Outlined statistics card',
  },
};

export const ElevatedVariant: Story = {
  args: {
    title: 'Elevated Stats',
    totalCount: 48,
    charts: [temperatureData, humidityData],
    variant: 'elevated',
    ariaLabel: 'Elevated statistics card',
  },
};

// With footer slot
export const WithFooter: Story = {
  args: {
    title: 'Stats with Actions',
    totalCount: 30,
    charts: [temperatureData, humidityData],
    footerSlot: (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 0',
        borderTop: '1px solid #E5E7EB',
        marginTop: '12px'
      }}>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>Last updated: 5 mins ago</span>
        <button style={{ 
          fontSize: '12px', 
          color: '#3B82F6', 
          background: 'none', 
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}>
          View Details
        </button>
      </div>
    ),
    ariaLabel: 'Statistics with footer actions',
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    title: 'Clickable Stats',
    totalCount: 56,
    charts: [temperatureData, humidityData],
    ariaLabel: 'Click to view detailed statistics',
  },
};

// Empty state (no data)
export const EmptyState: Story = {
  args: {
    title: 'No Data Available',
    totalCount: 0,
    charts: [],
    ariaLabel: 'No statistics available',
  },
};

// Real-world example
export const RealWorldExample: Story = {
  args: {
    title: 'Greenhouse A - Zone 1',
    totalCount: '12 Sensors',
    charts: [
      {
        title: 'Temperature',
        avgLabel: 'Current',
        avgValue: '24.5°C',
        totalLabel: 'Target',
        totalValue: '22-26°C',
        color: '#EF4444',
        data: [
          { label: '00:00', value: 22.5 },
          { label: '04:00', value: 22.8 },
          { label: '08:00', value: 23.2 },
          { label: '12:00', value: 24.5, isActive: true },
          { label: '16:00', value: 24.8 },
          { label: '20:00', value: 23.9 },
        ],
      },
      {
        title: 'Soil Moisture',
        avgLabel: 'Current',
        avgValue: '72%',
        totalLabel: 'Optimal',
        totalValue: '70-80%',
        color: '#06B6D4',
        data: [
          { label: '00:00', value: 75 },
          { label: '04:00', value: 74 },
          { label: '08:00', value: 73 },
          { label: '12:00', value: 72, isActive: true },
          { label: '16:00', value: 71 },
          { label: '20:00', value: 73 },
        ],
      },
    ],
    variant: 'elevated',
    ariaLabel: 'Greenhouse A Zone 1 environmental statistics',
  },
};