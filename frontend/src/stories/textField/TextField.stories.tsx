import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextField } from '../../shared/components/ui/TextField';
import { Box } from '@mui/material';

/**
 * The `TextField` component provides an input field for text entry.
 * It's built on top of Material UI's TextField component and follows Material Design guidelines.
 */
const meta = {
  title: 'UI/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'standard'],
      description: 'The variant of the TextField',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the TextField is disabled',
    },
    error: {
      control: 'boolean',
      description: 'Whether the TextField shows an error state',
    },
    multiline: {
      control: 'boolean',
      description: 'Whether the TextField supports multiple lines',
    },
    rows: {
      control: 'number',
      description: 'Number of rows to display when multiline is true',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the input',
    },
    className: {
      control: 'text',
      description: 'Custom CSS class name for styling',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Location TextField example from Figma design.
 */
export const Location: Story = {
  args: {
    label: 'Location',
    value: 'Lviv',
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
 * Default example of the TextField component.
 */
export const Default: Story = {
  args: {
    placeholder: 'Notes (optional)',
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
 * TextField component in a disabled state.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Notes (optional)',
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
 * TextField component with a label.
 */
export const WithLabel: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Enter notes here',
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
 * TextField component in error state.
 */
export const Error: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Enter notes here',
    error: true,
    helperText: 'This field is required',
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
 * TextField component as a multiline text area.
 */
export const Multiline: Story = {
  args: {
    placeholder: 'Notes (optional)',
    multiline: true,
    rows: 4,
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
 * TextField component with a different variant.
 */
export const FilledVariant: Story = {
  args: {
    placeholder: 'Notes (optional)',
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
 * Example showing how to use the TextField component with state.
 */
export const Interactive = () => {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Box sx={{ width: '372px' }}>
      <TextField
        placeholder="Notes (optional)"
        value={value}
        onChange={handleChange}
      />
      <Box sx={{ mt: 2, fontSize: '14px' }}>
        Current value: {value || '(empty)'}
      </Box>
    </Box>
  );
};