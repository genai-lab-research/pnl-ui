import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../../shared/components/ui/Checkbox';
import { Box } from '@mui/material';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium'],
    },
    labelPlacement: {
      control: { type: 'radio' },
      options: ['start', 'end', 'top', 'bottom'],
    },
    onChange: { action: 'changed' },
    color: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Default checkbox
export const Default: Story = {
  args: {
    checked: false,
  },
};

// Checked checkbox
export const Checked: Story = {
  args: {
    checked: true,
  },
};

// Indeterminate checkbox
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

// Disabled checkbox
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

// With label
export const WithLabel: Story = {
  args: {
    label: 'Checkbox Label',
  },
};

// Custom color
export const CustomColor: Story = {
  args: {
    checked: true,
    color: '#FF5733',
  },
};

// Multiple checkboxes example
export const CheckboxGroup: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Checkbox label="Option 1" />
      <Checkbox label="Option 2" checked />
      <Checkbox label="Option 3 (Disabled)" disabled />
      <Checkbox label="Option 4 (Indeterminate)" indeterminate />
    </Box>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Checkbox label="Small checkbox" size="small" />
      <Checkbox label="Medium checkbox" size="medium" />
    </Box>
  ),
};

// Different label placements
export const LabelPlacements: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Checkbox label="Label at start" labelPlacement="start" />
      <Checkbox label="Label at end" labelPlacement="end" />
      <Checkbox label="Label at top" labelPlacement="top" />
      <Checkbox label="Label at bottom" labelPlacement="bottom" />
    </Box>
  ),
};