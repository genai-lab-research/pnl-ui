import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { TimelapsSelector } from '../../shared/components/ui/TimelapsSelector';

// Create wrapper component for the story
const TimelapsSelectorExample = () => {
  const [currentTimepoint, setCurrentTimepoint] = useState<number>(0);

  const handleTimepointSelect = (timepoint: number) => {
    setCurrentTimepoint(timepoint);
  };

  return (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <TimelapsSelector
        currentTimepoint={currentTimepoint}
        onTimepointSelect={handleTimepointSelect}
      />
    </Box>
  );
};

const TimelapsSelectorDisabled = () => {
  return (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <TimelapsSelector
        currentTimepoint={0}
        disabled
      />
    </Box>
  );
};

const TimelapsSelectorWithFixedTimepoint = () => {
  return (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <TimelapsSelector
        currentTimepoint={4}
        onTimepointSelect={(timepoint) => console.log(`Timepoint ${timepoint} selected`)}
      />
    </Box>
  );
};

const TimelapsSelector5Points = () => {
  const [currentTimepoint, setCurrentTimepoint] = useState<number>(2);

  return (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <TimelapsSelector
        currentTimepoint={currentTimepoint}
        onTimepointSelect={setCurrentTimepoint}
        timepointCount={5}
      />
    </Box>
  );
};

const TimelapsSelector12Points = () => {
  const [currentTimepoint, setCurrentTimepoint] = useState<number>(7);

  return (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <TimelapsSelector
        currentTimepoint={currentTimepoint}
        onTimepointSelect={setCurrentTimepoint}
        timepointCount={12}
      />
    </Box>
  );
};

const TimelapsSelector24Points = () => {
  const [currentTimepoint, setCurrentTimepoint] = useState<number>(15);

  return (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <TimelapsSelector
        currentTimepoint={currentTimepoint}
        onTimepointSelect={setCurrentTimepoint}
        timepointCount={24}
      />
    </Box>
  );
};

const meta: Meta<typeof TimelapsSelector> = {
  title: 'UI/TimelapsSelector',
  component: TimelapsSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentTimepoint: {
      control: { type: 'number', min: 0 },
      description: 'Currently highlighted timepoint (0-based)',
    },
    onTimepointSelect: {
      description: 'Callback fired when a timepoint is selected',
    },
    timepointCount: {
      control: { type: 'number', min: 1, max: 50 },
      description: 'Number of timepoints to display',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'If true, will disable the entire component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimelapsSelector>;

export const Default: Story = {
  render: () => <TimelapsSelectorExample />
};

export const Disabled: Story = {
  render: () => <TimelapsSelectorDisabled />
};

export const WithFixedTimepoint: Story = {
  render: () => <TimelapsSelectorWithFixedTimepoint />
};

export const FiveTimepoints: Story = {
  render: () => <TimelapsSelector5Points />
};

export const TwelveTimepoints: Story = {
  render: () => <TimelapsSelector12Points />
};

export const TwentyFourTimepoints: Story = {
  render: () => <TimelapsSelector24Points />
};