import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { TimelineComponent } from '../../shared/components/ui/TimelineComponent/TimelineComponent';

const meta: Meta<typeof TimelineComponent> = {
  title: 'Components/TimelineComponent',
  component: TimelineComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selectedInterval: {
      control: 'number',
      description: 'The currently selected interval index (0-based)',
    },
    intervalCount: {
      control: 'number',
      description: 'Number of intervals to show in the timeline',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, disables all interactions',
    },
    labels: {
      control: 'object',
      description: 'Labels to display at the start and end of the timeline',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineComponent>;

export const Default: Story = {
  args: {
    selectedInterval: 3,
    intervalCount: 12,
    labels: {
      start: '01\nApr',
      end: '15\nApr',
    },
    disabled: false,
  },
};

export const WithManyIntervals: Story = {
  args: {
    selectedInterval: 6,
    intervalCount: 30,
    labels: {
      start: 'Jan',
      end: 'Dec',
    },
  },
};

export const Disabled: Story = {
  args: {
    selectedInterval: 2,
    intervalCount: 10,
    disabled: true,
  },
};

// Interactive example with custom render function
const InteractiveTemplate: React.FC<React.ComponentProps<typeof TimelineComponent>> = (args) => {
  const [selectedInterval, setSelectedInterval] = useState(3);
  return (
    <div style={{ width: '400px' }}>
      <TimelineComponent
        {...args}
        selectedInterval={selectedInterval}
        onIntervalClick={setSelectedInterval}
      />
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Selected interval: {selectedInterval + 1}
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: (args) => <InteractiveTemplate {...args} />,
  args: {
    intervalCount: 12,
    labels: {
      start: '01\nApr',
      end: '15\nApr',
    },
  },
};