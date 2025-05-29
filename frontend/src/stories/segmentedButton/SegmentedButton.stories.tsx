import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { SegmentedButton } from '../../shared/components/ui/SegmentedButton';

const meta: Meta<typeof SegmentedButton> = {
  component: SegmentedButton,
  title: 'UI/SegmentedButton',
  argTypes: {
    value: {
      control: 'text',
      description: 'Currently selected value',
    },
    options: {
      control: 'object',
      description: 'Array of segment options',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the value changes',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the segmented button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedButton>;

// Type for story args
type StoryArgs = {
  value?: string;
  options: Array<{ value: string; label: string }>;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

// Interactive story components
const DefaultStory = (args: StoryArgs) => {
  const [value, setValue] = useState(args.value || 'physical');
  return (
    <SegmentedButton
      {...args}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        args.onChange?.(newValue);
      }}
    />
  );
};

const MultipleOptionsStory = (args: StoryArgs) => {
  const [value, setValue] = useState(args.value || 'day');
  return (
    <SegmentedButton
      {...args}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        args.onChange?.(newValue);
      }}
    />
  );
};

const SizesStory = (args: StoryArgs) => {
  const [value, setValue] = useState(args.value || 'physical');
  return (
    <SegmentedButton
      {...args}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        args.onChange?.(newValue);
      }}
    />
  );
};

// Stories
export const Default: Story = {
  render: (args) => <DefaultStory {...args} />,
  args: {
    value: 'physical',
    options: [
      { value: 'physical', label: 'Physical' },
      { value: 'virtual', label: 'Virtual' },
    ],
    disabled: false,
    size: 'medium',
  },
};

export const Disabled: Story = {
  render: (args) => (
    <SegmentedButton {...args} />
  ),
  args: {
    value: 'physical',
    options: [
      { value: 'physical', label: 'Physical' },
      { value: 'virtual', label: 'Virtual' },
    ],
    disabled: true,
  },
};

export const MultipleOptions: Story = {
  render: (args) => <MultipleOptionsStory {...args} />,
  args: {
    value: 'day',
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
      { value: 'year', label: 'Year' },
    ],
    disabled: false,
  },
};

export const Small: Story = {
  render: (args) => <SizesStory {...args} />,
  args: {
    value: 'physical',
    options: [
      { value: 'physical', label: 'Physical' },
      { value: 'virtual', label: 'Virtual' },
    ],
    size: 'small',
  },
};

export const Large: Story = {
  render: (args) => <SizesStory {...args} />,
  args: {
    value: 'physical',
    options: [
      { value: 'physical', label: 'Physical' },
      { value: 'virtual', label: 'Virtual' },
    ],
    size: 'large',
  },
};