import type { Meta, StoryObj } from '@storybook/react';
import { Timelaps } from '../../shared/components/ui/Timelaps';

const meta = {
  title: 'UI/Timelaps',
  component: Timelaps,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Timelaps>;

export default meta;
type Story = StoryObj<typeof meta>;

// Create a helper function to generate cell data
const generateCells = (activeIndex: number, count: number = 62) => {
  return Array(count).fill(null).map((_, index) => ({
    isActive: index <= activeIndex,
    isFuture: index > activeIndex
  }));
};

export const Default: Story = {
  args: {
    cells: generateCells(30),
    startDate: '05 Apr',
    endDate: '06 Jun',
  },
};

export const WithTooltip: Story = {
  args: {
    cells: generateCells(30),
    startDate: '05 Apr',
    endDate: '06 Jun',
    currentDayIndex: 30,
  },
};

export const EmptyTimeline: Story = {
  args: {
    cells: generateCells(-1), // No active cells
    startDate: '05 Apr',
    endDate: '06 Jun',
  },
};

export const FullTimeline: Story = {
  args: {
    cells: generateCells(61), // All cells active
    startDate: '05 Apr',
    endDate: '06 Jun',
  },
};