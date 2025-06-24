import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { TimeRangeSelector, TimeRange } from '../../shared/components/ui/TimeRangeSelector';

const meta: Meta<typeof TimeRangeSelector> = {
  title: 'UI/TimeRangeSelector',
  component: TimeRangeSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimeRangeSelector>;

const TimeRangeSelectorWithState = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('Week');
  
  return (
    <TimeRangeSelector
      selectedRange={selectedRange}
      onRangeChange={setSelectedRange}
    />
  );
};

export const Default: Story = {
  render: () => <TimeRangeSelectorWithState />,
};

export const WeekSelected: Story = {
  args: {
    selectedRange: 'Week',
    onRangeChange: () => {},
  },
};

export const MonthSelected: Story = {
  args: {
    selectedRange: 'Month',
    onRangeChange: () => {},
  },
};

export const QuarterSelected: Story = {
  args: {
    selectedRange: 'Quarter',
    onRangeChange: () => {},
  },
};

export const YearSelected: Story = {
  args: {
    selectedRange: 'Year',
    onRangeChange: () => {},
  },
};