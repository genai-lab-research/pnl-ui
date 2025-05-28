import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { SelectorButtonGroup } from '../../shared/components/ui/Container';

const meta = {
  title: 'Container/SelectorButtonGroup',
  component: SelectorButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectorButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// The default time period options
const timeOptions = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'quarter', label: 'Quarter' },
  { id: 'year', label: 'Year' },
];

// Interactive story with state management
export const Interactive = () => {
  const [selected, setSelected] = useState('week');

  return <SelectorButtonGroup options={timeOptions} selectedId={selected} onChange={setSelected} />;
};

// Basic static example
export const Default: Story = {
  args: {
    options: timeOptions,
    selectedId: 'week',
  },
};

// Example with a disabled option
export const WithDisabledOption: Story = {
  args: {
    options: [
      { id: 'week', label: 'Week' },
      { id: 'month', label: 'Month' },
      { id: 'quarter', label: 'Quarter', disabled: true },
      { id: 'year', label: 'Year' },
    ],
    selectedId: 'month',
  },
};

// Small size variation
export const Small: Story = {
  args: {
    options: timeOptions,
    selectedId: 'month',
    size: 'small',
  },
};
