import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { CheckboxWithLabel } from '../../shared/components/ui/CheckboxWithLabel';
import { Box } from '@mui/material';

const meta: Meta<typeof CheckboxWithLabel> = {
  title: 'UI/CheckboxWithLabel',
  component: CheckboxWithLabel,
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
    label: { control: 'text' }
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxWithLabel>;

// Default checkbox with label
export const Default: Story = {
  args: {
    label: 'Connect to other systems after creation',
    checked: false,
  },
};

// Checked checkbox with label
export const Checked: Story = {
  args: {
    label: 'Connect to other systems after creation',
    checked: true,
  },
};

// Indeterminate checkbox with label
export const Indeterminate: Story = {
  args: {
    label: 'Connect to other systems after creation',
    indeterminate: true,
  },
};

// Disabled checkbox with label
export const Disabled: Story = {
  args: {
    label: 'Connect to other systems after creation',
    disabled: true,
  },
};

// Different label placements
export const LabelPlacements: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <CheckboxWithLabel 
        label="Connect to other systems after creation" 
        labelPlacement="start" 
      />
      <CheckboxWithLabel 
        label="Connect to other systems after creation" 
        labelPlacement="end" 
      />
      <CheckboxWithLabel 
        label="Connect to other systems after creation" 
        labelPlacement="top" 
      />
      <CheckboxWithLabel 
        label="Connect to other systems after creation" 
        labelPlacement="bottom" 
      />
    </Box>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <CheckboxWithLabel 
        label="Connect to other systems after creation (Small)" 
        size="small" 
      />
      <CheckboxWithLabel 
        label="Connect to other systems after creation (Medium)" 
        size="medium" 
      />
    </Box>
  ),
};

// Multiple checkboxes with labels
export const CheckboxGroup: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <CheckboxWithLabel label="Option 1: Connect to other systems after creation" />
      <CheckboxWithLabel label="Option 2: Automatically detect container settings" checked />
      <CheckboxWithLabel label="Option 3: Initialize with default configurations (Disabled)" disabled />
      <CheckboxWithLabel label="Option 4: Use system preferences (Indeterminate)" indeterminate />
    </Box>
  ),
};