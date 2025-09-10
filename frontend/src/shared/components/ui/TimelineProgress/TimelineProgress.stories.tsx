import type { Meta, StoryObj } from '@storybook/react';
import { TimelineProgress } from './TimelineProgress';

const meta: Meta<typeof TimelineProgress> = {
  title: 'UI/TimelineProgress',
  component: TimelineProgress,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A timeline progress component that visualizes progress through a series of days or steps with a current position indicator.',
      },
    },
  },
  argTypes: {
    startDate: {
      control: 'text',
      description: 'Label for the start date',
    },
    endDate: {
      control: 'text',
      description: 'Label for the end date',
    },
    currentDay: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Current day/step position',
    },
    totalDays: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Total number of days/steps',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show tooltip indicator',
    },
    tooltipLabel: {
      control: 'text',
      description: 'Text to display in tooltip',
    },
    accentColor: {
      control: 'color',
      description: 'Color for the current day indicator',
    },
    baseColor: {
      control: 'color',
      description: 'Base color for timeline blocks',
    },
    futureOpacity: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'Opacity for future days',
    },
    gap: {
      control: { type: 'number', min: 0, max: 20 },
      description: 'Gap between timeline blocks',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    startDate: '05 Apr',
    endDate: '06 Jun',
    currentDay: 36,
    totalDays: 62,
    showTooltip: true,
    tooltipLabel: 'Today',
  },
};

export const ProjectTimeline: Story = {
  args: {
    startDate: '01 Jan',
    endDate: '31 Dec',
    currentDay: 145,
    totalDays: 365,
    showTooltip: true,
    tooltipLabel: 'Current Sprint',
    accentColor: '#4CAF50',
    baseColor: '#E0E0E0',
  },
};

export const ManufacturingProcess: Story = {
  args: {
    startDate: 'Start',
    endDate: 'Complete',
    currentDay: 7,
    totalDays: 10,
    showTooltip: true,
    tooltipLabel: 'Stage 7',
    accentColor: '#FF9800',
    baseColor: '#FFF3E0',
    futureOpacity: 0.3,
  },
};

export const DeliveryTracking: Story = {
  args: {
    startDate: 'Shipped',
    endDate: 'Delivered',
    currentDay: 3,
    totalDays: 5,
    showTooltip: true,
    tooltipLabel: 'In Transit',
    accentColor: '#2196F3',
    baseColor: '#E3F2FD',
    gap: 8,
  },
};

export const WithoutTooltip: Story = {
  args: {
    startDate: 'Q1',
    endDate: 'Q4',
    currentDay: 2,
    totalDays: 4,
    showTooltip: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Error: Story = {
  args: {
    error: 'Failed to load timeline data',
  },
};

export const Interactive: Story = {
  args: {
    startDate: 'Week 1',
    endDate: 'Week 12',
    currentDay: 6,
    totalDays: 12,
    showTooltip: true,
    tooltipLabel: 'Week 6',
    onDayClick: (day: number) => {
      console.log(`Clicked on day ${day}`);
      alert(`You clicked on week ${day}`);
    },
  },
};

export const CustomStyling: Story = {
  args: {
    startDate: 'Phase 1',
    endDate: 'Phase 5',
    currentDay: 3,
    totalDays: 5,
    showTooltip: true,
    tooltipLabel: 'Current Phase',
    accentColor: '#9C27B0',
    baseColor: '#F3E5F5',
    futureOpacity: 0.5,
    gap: 12,
    height: 24,
    borderRadius: 8,
  },
};

export const LongTimeline: Story = {
  args: {
    startDate: 'Day 1',
    endDate: 'Day 100',
    currentDay: 75,
    totalDays: 100,
    showTooltip: true,
    tooltipLabel: 'Day 75',
    gap: 2,
  },
};