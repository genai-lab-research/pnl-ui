import type { Meta, StoryObj } from '@storybook/react';
import { ContainerStatisticsCard } from '../../shared/components/ui/ContainerStatisticsCard';

const meta = {
  title: 'Components/ContainerStatisticsCard',
  component: ContainerStatisticsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    totalCount: { control: 'number' },
    avgYield: { control: 'text' },
    totalYield: { control: 'text' },
    avgUtilization: { control: 'text' },
    currentDay: { control: { type: 'range', min: 0, max: 6 } },
  },
} satisfies Meta<typeof ContainerStatisticsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for the charts
const yieldData = [
  { day: 'Mon', value: 60 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 55 },
  { day: 'Thu', value: 40 },
  { day: 'Fri', value: 65 },
  { day: 'Sat', value: 0 },
  { day: 'Sun', value: 0 },
];

const utilizationData = [
  { day: 'Mon', value: 85 },
  { day: 'Tue', value: 70 },
  { day: 'Wed', value: 80 },
  { day: 'Thu', value: 65 },
  { day: 'Fri', value: 90 },
  { day: 'Sat', value: 0 },
  { day: 'Sun', value: 0 },
];

export const Default: Story = {
  args: {
    title: 'Physical Containers',
    subtitle: 'Weekly',
    totalCount: 4,
    yieldData,
    utilizationData,
    avgYield: '63KG',
    totalYield: '81KG',
    avgUtilization: '80%',
    currentDay: 4, // Friday
  },
};

export const NoSubtitle: Story = {
  args: {
    ...Default.args,
    subtitle: undefined,
  },
};

export const HighYield: Story = {
  args: {
    ...Default.args,
    yieldData: [
      { day: 'Mon', value: 80 },
      { day: 'Tue', value: 75 },
      { day: 'Wed', value: 85 },
      { day: 'Thu', value: 90 },
      { day: 'Fri', value: 95 },
      { day: 'Sat', value: 0 },
      { day: 'Sun', value: 0 },
    ],
    avgYield: '85KG',
    totalYield: '125KG',
  },
};

export const LowUtilization: Story = {
  args: {
    ...Default.args,
    utilizationData: [
      { day: 'Mon', value: 45 },
      { day: 'Tue', value: 40 },
      { day: 'Wed', value: 50 },
      { day: 'Thu', value: 35 },
      { day: 'Fri', value: 55 },
      { day: 'Sat', value: 0 },
      { day: 'Sun', value: 0 },
    ],
    avgUtilization: '45%',
  },
};

export const WeekendActivity: Story = {
  args: {
    ...Default.args,
    yieldData: [
      { day: 'Mon', value: 60 },
      { day: 'Tue', value: 45 },
      { day: 'Wed', value: 55 },
      { day: 'Thu', value: 40 },
      { day: 'Fri', value: 65 },
      { day: 'Sat', value: 35 },
      { day: 'Sun', value: 20 },
    ],
    utilizationData: [
      { day: 'Mon', value: 85 },
      { day: 'Tue', value: 70 },
      { day: 'Wed', value: 80 },
      { day: 'Thu', value: 65 },
      { day: 'Fri', value: 90 },
      { day: 'Sat', value: 50 },
      { day: 'Sun', value: 30 },
    ],
    currentDay: 6, // Sunday
  },
};