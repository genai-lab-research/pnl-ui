import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select } from '../../shared/components/ui/Select';
import { Box } from '@mui/material';

// Sample options for the select component
const sampleOptions = [
  { value: 'farm-container-01', label: 'farm-container-01' },
  { value: 'farm-container-02', label: 'farm-container-02' },
  { value: 'farm-container-03', label: 'farm-container-03' },
  { value: 'farm-container-04', label: 'farm-container-04' },
  { value: 'farm-container-05', label: 'farm-container-05' },
];

/**
 * The `Select` component provides a dropdown menu for selecting from a list of options.
 * It's built on top of Material UI's Select component and follows Material Design guidelines.
 */
const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options for the select dropdown',
    },
    label: {
      control: 'text',
      description: 'Label text for the select',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the select',
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'standard'],
      description: 'The variant of the Select',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'The size of the Select',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the Select is disabled',
    },
    error: {
      control: 'boolean',
      description: 'Whether the Select shows an error state',
    },
    className: {
      control: 'text',
      description: 'Custom CSS class name for styling',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default example of the Select component.
 */
export const Default: Story = {
  args: {
    options: sampleOptions,
    label: 'Container Name',
    value: 'farm-container-04',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '372px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Select component in a disabled state.
 */
export const Disabled: Story = {
  args: {
    options: sampleOptions,
    label: 'Container Name',
    value: 'farm-container-04',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '372px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Select component with an error state.
 */
export const Error: Story = {
  args: {
    options: sampleOptions,
    label: 'Container Name',
    value: '',
    error: true,
    helperText: 'Please select a container',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '372px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Select component with a small size.
 */
export const Small: Story = {
  args: {
    options: sampleOptions,
    label: 'Container Name',
    value: 'farm-container-04',
    size: 'small',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '372px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Select component with a filled variant.
 */
export const FilledVariant: Story = {
  args: {
    options: sampleOptions,
    label: 'Container Name',
    value: 'farm-container-04',
    variant: 'filled',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '372px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Interactive example showing how to use the Select component with state.
 */
export const Interactive = () => {
  const [value, setValue] = useState('farm-container-04');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);
  };

  return (
    <Box sx={{ width: '372px' }}>
      <Select
        options={sampleOptions}
        label="Container Name"
        value={value}
        onChange={handleChange}
      />
      <Box sx={{ mt: 2, fontSize: '14px' }}>
        Selected value: {value}
      </Box>
    </Box>
  );
};