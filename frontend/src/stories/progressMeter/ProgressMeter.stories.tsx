import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { ProgressMeter } from '../../shared/components/ui/ProgressMeter';

const meta: Meta<typeof ProgressMeter> = {
  title: 'UI/ProgressMeter',
  component: ProgressMeter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Progress value in percentage (0-100)',
    },
    width: {
      control: { type: 'number', min: 50, max: 500 },
      description: 'Max width of the progress bar in pixels',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'If true, will disable the entire component with reduced opacity',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressMeter>;

export const Default: Story = {
  args: {
    value: 75,
    width: 200,
  },
  render: (args) => (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <ProgressMeter {...args} />
    </Box>
  ),
};

export const LowProgress: Story = {
  args: {
    value: 25,
    width: 200,
  },
  render: (args) => (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <ProgressMeter {...args} />
    </Box>
  ),
};

export const HighProgress: Story = {
  args: {
    value: 90,
    width: 200,
  },
  render: (args) => (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <ProgressMeter {...args} />
    </Box>
  ),
};

export const Disabled: Story = {
  args: {
    value: 75,
    width: 200,
    disabled: true,
  },
  render: (args) => (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <ProgressMeter {...args} />
    </Box>
  ),
};

export const WiderProgressBar: Story = {
  args: {
    value: 75,
    width: 300,
  },
  render: (args) => (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <ProgressMeter {...args} />
    </Box>
  ),
};