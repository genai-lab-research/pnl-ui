import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { BaseCheckbox } from './BaseCheckbox';
import type { BaseCheckboxProps } from './types';

const meta: Meta<typeof BaseCheckbox> = {
  title: 'UI/BaseCheckbox',
  component: BaseCheckbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable, domain-agnostic checkbox component with multiple variants, sizes, and states.',
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the checkbox is in loading state',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'outlined', 'elevated'],
      description: 'Visual variant of the checkbox',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the checkbox',
    },
    label: {
      control: 'text',
      description: 'Label text for the checkbox',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper for controlled state
const CheckboxWrapper = (props: Partial<BaseCheckboxProps>) => {
  const [checked, setChecked] = useState(props.checked || false);
  
  return (
    <BaseCheckbox
      {...props}
      checked={checked}
      onChange={setChecked}
    />
  );
};

// Default story
export const Default: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    label: 'Accept terms and conditions',
    variant: 'default',
    size: 'md',
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <CheckboxWrapper label="Default" variant="default" />
      <CheckboxWrapper label="Outlined" variant="outlined" />
      <CheckboxWrapper label="Elevated" variant="elevated" />
      <CheckboxWrapper label="Compact" variant="compact" />
    </div>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <CheckboxWrapper label="Small" size="sm" />
      <CheckboxWrapper label="Medium" size="md" />
      <CheckboxWrapper label="Large" size="lg" />
    </div>
  ),
};

// Different states
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <CheckboxWrapper label="Unchecked" checked={false} />
      <CheckboxWrapper label="Checked" checked={true} />
      <CheckboxWrapper label="Disabled" disabled />
      <CheckboxWrapper label="Disabled Checked" disabled checked />
      <CheckboxWrapper label="Loading" loading />
      <CheckboxWrapper label="Error" error="This field is required" />
    </div>
  ),
};

// Custom icons
export const CustomIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <CheckboxWrapper
        label="Favorite"
        checkedIcon={<FavoriteIcon />}
        uncheckedIcon={<FavoriteBorderIcon />}
      />
      <CheckboxWrapper
        label="Custom Icon (Large)"
        size="lg"
        checkedIcon={<FavoriteIcon />}
        uncheckedIcon={<FavoriteBorderIcon />}
      />
    </div>
  ),
};

// Reusable metric examples - demonstrating domain-agnostic usage
export const ReusableExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3>Metric Selection</h3>
      <CheckboxWrapper label="Enable temperature monitoring" />
      <CheckboxWrapper label="Enable humidity tracking" />
      <CheckboxWrapper label="Enable light sensor data" />
      
      <h3>Task Management</h3>
      <CheckboxWrapper label="Daily system check completed" checked />
      <CheckboxWrapper label="Weekly maintenance scheduled" />
      <CheckboxWrapper label="Monthly report generated" />
      
      <h3>User Preferences</h3>
      <CheckboxWrapper label="Send email notifications" variant="outlined" />
      <CheckboxWrapper label="Enable dark mode" variant="outlined" />
      <CheckboxWrapper label="Auto-save settings" variant="outlined" checked />
    </div>
  ),
};

// Interactive playground
export const Playground: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    label: 'Custom checkbox label',
    variant: 'default',
    size: 'md',
    disabled: false,
    loading: false,
    error: '',
  },
};
