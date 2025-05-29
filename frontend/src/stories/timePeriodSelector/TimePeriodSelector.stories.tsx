import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { TimePeriodSelector, TimePeriod } from '../../shared/components/ui/TimePeriodSelector';

// Create wrapper component for the story
const TimePeriodSelectorExample = () => {
  const [value, setValue] = useState<TimePeriod>('week');

  const handleChange = (newValue: TimePeriod) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '400px', maxWidth: '100%' }}>
      <TimePeriodSelector
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
};

const TimePeriodSelectorWithDisabledOptions = () => {
  const [value, setValue] = useState<TimePeriod>('week');

  const handleChange = (newValue: TimePeriod) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '400px', maxWidth: '100%' }}>
      <TimePeriodSelector
        value={value}
        onChange={handleChange}
        options={[
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month', disabled: true },
          { label: 'Quarter', value: 'quarter' },
          { label: 'Year', value: 'year' },
        ]}
      />
    </Box>
  );
};

const TimePeriodSelectorDisabled = () => {
  const [value] = useState<TimePeriod>('week');

  const handleChange = () => {
    // No-op for disabled component
  };

  return (
    <Box sx={{ width: '400px', maxWidth: '100%' }}>
      <TimePeriodSelector
        value={value}
        onChange={handleChange}
        disabled
      />
    </Box>
  );
};

const TimePeriodSelectorMobile = () => {
  const [value, setValue] = useState<TimePeriod>('week');

  const handleChange = (newValue: TimePeriod) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '320px', maxWidth: '100%' }}>
      <TimePeriodSelector
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
};

const TimePeriodSelectorCustomOptions = () => {
  const [value, setValue] = useState<TimePeriod>('week');

  const handleChange = (newValue: TimePeriod) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '400px', maxWidth: '100%' }}>
      <TimePeriodSelector
        value={value}
        onChange={handleChange}
        options={[
          { label: 'Daily', value: 'week' },
          { label: 'Weekly', value: 'month' },
          { label: 'Monthly', value: 'quarter' },
        ]}
      />
    </Box>
  );
};

const meta: Meta<typeof TimePeriodSelector> = {
  title: 'UI/TimePeriodSelector',
  component: TimePeriodSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      options: ['week', 'month', 'quarter', 'year'],
      control: { type: 'radio' },
      description: 'The currently selected time period value',
    },
    onChange: {
      description: 'Callback fired when the value changes',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'If true, will disable the entire component',
    },
    options: {
      description: 'Optional override of the tabs',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePeriodSelector>;

export const Default: Story = {
  render: () => <TimePeriodSelectorExample />
};

export const WithDisabledOptions: Story = {
  render: () => <TimePeriodSelectorWithDisabledOptions />
};

export const Disabled: Story = {
  render: () => <TimePeriodSelectorDisabled />
};

export const Mobile: Story = {
  render: () => <TimePeriodSelectorMobile />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  }
};

export const CustomOptions: Story = {
  render: () => <TimePeriodSelectorCustomOptions />
};