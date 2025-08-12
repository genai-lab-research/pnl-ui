import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FiSave, FiTrash2, FiEdit, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import ActionButton from './ActionButton';

const meta = {
  title: 'UI/ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A versatile button component that supports various visual styles, sizes, and states.

## Features
- Multiple variant styles (primary, secondary, outlined, ghost)
- Three size options (sm, md, lg)
- Loading and disabled states
- Icon support with flexible positioning
- Full-width layout option
- Error state with message display
- Comprehensive accessibility features
- Form integration support

## Usage
Perfect for primary actions, form submissions, navigation triggers, and any interactive button needs in your application.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Button text label',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outlined', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Full width button',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default button
export const Default: Story = {
  args: {
    label: 'Click me',
  },
};

// Primary variant examples
export const PrimaryWithIcon: Story = {
  args: {
    label: 'Save',
    icon: <FiSave />,
    variant: 'primary',
  },
};

export const PrimaryLoading: Story = {
  args: {
    label: 'Saving...',
    variant: 'primary',
    loading: true,
  },
};

// Secondary variant examples
export const SecondaryButton: Story = {
  args: {
    label: 'Cancel',
    variant: 'secondary',
  },
};

export const SecondaryWithIcon: Story = {
  args: {
    label: 'Edit',
    icon: <FiEdit />,
    variant: 'secondary',
  },
};

// Outlined variant examples
export const OutlinedButton: Story = {
  args: {
    label: 'View Details',
    variant: 'outlined',
  },
};

export const OutlinedWithIcon: Story = {
  args: {
    label: 'Add Item',
    icon: <FiPlus />,
    variant: 'outlined',
  },
};

// Ghost variant examples
export const GhostButton: Story = {
  args: {
    label: 'Learn More',
    variant: 'ghost',
  },
};

export const GhostDanger: Story = {
  args: {
    label: 'Delete',
    icon: <FiTrash2 />,
    variant: 'ghost',
    className: 'text-red-600 hover:text-red-700',
  },
};

// Size variations
export const SmallButton: Story = {
  args: {
    label: 'Small',
    size: 'sm',
  },
};

export const MediumButton: Story = {
  args: {
    label: 'Medium',
    size: 'md',
  },
};

export const LargeButton: Story = {
  args: {
    label: 'Large',
    size: 'lg',
  },
};

// State examples
export const DisabledButton: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const LoadingButton: Story = {
  args: {
    label: 'Processing...',
    loading: true,
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Submit',
    error: 'Please fix the errors above',
  },
};

// Full width example
export const FullWidth: Story = {
  args: {
    label: 'Continue',
    fullWidth: true,
    variant: 'primary',
  },
};

// Form submission button
export const SubmitButton: Story = {
  args: {
    label: 'Submit Form',
    type: 'submit',
    icon: <FiCheck />,
    variant: 'primary',
  },
};

// Complex interaction example
export const ComplexExample: Story = {
  args: {
    label: 'Upload File',
    icon: <FiPlus />,
    variant: 'primary',
    size: 'lg',
    ariaLabel: 'Upload a new file',
    id: 'upload-button',
  },
};

// Icon-only button (with aria-label)
export const IconOnly: Story = {
  args: {
    label: '',
    icon: <FiX />,
    variant: 'ghost',
    size: 'sm',
    ariaLabel: 'Close dialog',
  },
};