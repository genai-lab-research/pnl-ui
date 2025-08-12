import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FiCheck, FiX } from 'react-icons/fi';
import CheckboxInput from './CheckboxInput';

const meta = {
  title: 'UI/CheckboxInput',
  component: CheckboxInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A fully responsive and accessible checkbox input component with extensive features.

## Features
- Controlled and uncontrolled usage patterns
- Multiple visual variants (default, compact, outlined, elevated)
- Three size options (sm, md, lg)
- Loading and disabled states
- Indeterminate state for partial selections
- Error state with validation messages
- Custom icon support
- Full keyboard navigation and accessibility
- Proper form integration with name/value support

## Usage
Perfect for forms, settings toggles, multi-select lists, and any scenario requiring binary or tri-state selection.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Current checked state (controlled)',
    },
    defaultChecked: {
      control: { type: 'boolean' },
      description: 'Default checked state (uncontrolled)',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'outlined', 'elevated'],
      description: 'Visual variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size scale',
    },
    indeterminate: {
      control: { type: 'boolean' },
      description: 'Indeterminate state for partial selection',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessibility label',
    },
  },
  args: {
    onChange: fn(),
    ariaLabel: 'Select option',
  },
} satisfies Meta<typeof CheckboxInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default checkbox
export const Default: Story = {
  args: {
    ariaLabel: 'Default checkbox',
  },
};

// Checked state
export const Checked: Story = {
  args: {
    checked: true,
    ariaLabel: 'Checked checkbox',
  },
};

// Uncontrolled with default checked
export const UncontrolledChecked: Story = {
  args: {
    defaultChecked: true,
    ariaLabel: 'Default checked checkbox',
  },
};

// Disabled states
export const Disabled: Story = {
  args: {
    disabled: true,
    ariaLabel: 'Disabled checkbox',
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    ariaLabel: 'Disabled checked checkbox',
  },
};

// Loading state
export const Loading: Story = {
  args: {
    loading: true,
    ariaLabel: 'Loading checkbox',
  },
};

// Size variations
export const SmallSize: Story = {
  args: {
    size: 'sm',
    ariaLabel: 'Small checkbox',
  },
};

export const MediumSize: Story = {
  args: {
    size: 'md',
    ariaLabel: 'Medium checkbox',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    ariaLabel: 'Large checkbox',
  },
};

// Variant examples
export const CompactVariant: Story = {
  args: {
    variant: 'compact',
    ariaLabel: 'Compact checkbox',
  },
};

export const OutlinedVariant: Story = {
  args: {
    variant: 'outlined',
    ariaLabel: 'Outlined checkbox',
  },
};

export const ElevatedVariant: Story = {
  args: {
    variant: 'elevated',
    ariaLabel: 'Elevated checkbox',
  },
};

// Indeterminate state
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    ariaLabel: 'Indeterminate checkbox',
  },
};

// Error state
export const WithError: Story = {
  args: {
    error: 'This field is required',
    ariaLabel: 'Required checkbox',
  },
};

// Custom icon
export const WithCustomIcon: Story = {
  args: {
    checked: true,
    iconSlot: <FiCheck size={14} />,
    ariaLabel: 'Custom icon checkbox',
  },
};

// Form integration example
export const FormIntegration: Story = {
  args: {
    name: 'terms',
    value: 'accepted',
    id: 'terms-checkbox',
    ariaLabel: 'Accept terms and conditions',
  },
};

// Complex example with multiple features
export const ComplexExample: Story = {
  args: {
    variant: 'elevated',
    size: 'lg',
    name: 'notifications',
    value: 'enabled',
    ariaLabel: 'Enable email notifications',
  },
};

// Multiple checkboxes example
export const MultipleCheckboxes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <CheckboxInput ariaLabel="Option 1" defaultChecked />
      <CheckboxInput ariaLabel="Option 2" />
      <CheckboxInput ariaLabel="Option 3" defaultChecked />
      <CheckboxInput ariaLabel="Option 4" disabled />
    </div>
  ),
};

// Sizes comparison
export const SizesComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <CheckboxInput size="sm" ariaLabel="Small size" defaultChecked />
      <CheckboxInput size="md" ariaLabel="Medium size" defaultChecked />
      <CheckboxInput size="lg" ariaLabel="Large size" defaultChecked />
    </div>
  ),
};

// Variants comparison
export const VariantsComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <CheckboxInput variant="default" ariaLabel="Default variant" defaultChecked />
      <CheckboxInput variant="compact" ariaLabel="Compact variant" defaultChecked />
      <CheckboxInput variant="outlined" ariaLabel="Outlined variant" defaultChecked />
      <CheckboxInput variant="elevated" ariaLabel="Elevated variant" defaultChecked />
    </div>
  ),
};