import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select } from './Select';
import { SelectProps, SelectOption } from './types';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable Select component with customizable options and styling, designed to be domain-agnostic and composable.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['outlined', 'filled'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    onChange: { action: 'changed' },
    onToggle: { action: 'toggled' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample options for different scenarios
const purposeOptions: SelectOption[] = [
  { value: 'production', label: 'Production' },
  { value: 'research', label: 'Research' },
  { value: 'testing', label: 'Testing' },
  { value: 'development', label: 'Development' },
];

const cropOptions: SelectOption[] = [
  { value: 'lettuce', label: 'Lettuce' },
  { value: 'tomato', label: 'Tomato' },
  { value: 'herbs', label: 'Herbs' },
  { value: 'spinach', label: 'Spinach' },
  { value: 'kale', label: 'Kale' },
];

const statusOptions: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Under Maintenance' },
  { value: 'error', label: 'Error', disabled: true },
];

// Controlled component wrapper for stories
const ControlledSelect = (props: SelectProps) => {
  const [value, setValue] = useState<string | undefined>(props.value);
  
  return (
    <Select
      {...props}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        props.onChange?.(newValue);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <ControlledSelect {...args} />,
  args: {
    label: 'Purpose',
    placeholder: 'Select purpose',
    options: purposeOptions,
    variant: 'outlined',
    size: 'medium',
  },
};

export const WithValue: Story = {
  render: (args) => <ControlledSelect {...args} />,
  args: {
    label: 'Crop Type',
    options: cropOptions,
    value: 'lettuce',
    variant: 'outlined',
    size: 'medium',
  },
};

export const Required: Story = {
  render: (args) => <ControlledSelect {...args} />,
  args: {
    label: 'Status',
    placeholder: 'Select status',
    options: statusOptions,
    required: true,
    helperText: 'This field is required',
    variant: 'outlined',
    size: 'medium',
  },
};

export const Error: Story = {
  render: (args) => <ControlledSelect {...args} />,
  args: {
    label: 'Purpose',
    placeholder: 'Select purpose',
    options: purposeOptions,
    error: true,
    errorMessage: 'Please select a valid purpose',
    variant: 'outlined',
    size: 'medium',
  },
};

export const Disabled: Story = {
  render: (args) => <ControlledSelect {...args} />,
  args: {
    label: 'Purpose',
    placeholder: 'Select purpose',
    options: purposeOptions,
    disabled: true,
    value: 'production',
    variant: 'outlined',
    size: 'medium',
  },
};

export const Loading: Story = {
  render: (args) => <ControlledSelect {...args} />,
  args: {
    label: 'Purpose',
    placeholder: 'Loading options...',
    options: [],
    loading: true,
    variant: 'outlined',
    size: 'medium',
  },
};

export const Small: Story = {
  render: (args) => <ControlledSelect {...args} />,
  args: {
    label: 'Purpose',
    placeholder: 'Select purpose',
    options: purposeOptions,
    size: 'small',
    variant: 'outlined',
  },
};

export const Large: Story = {
  render: (args) => <ControlledSelect {...args} />,
  args: {
    label: 'Purpose',
    placeholder: 'Select purpose',
    options: purposeOptions,
    size: 'large',
    variant: 'outlined',
  },
};

export const Filled: Story = {
  render: (args) => <ControlledSelect {...args} />,
  args: {
    label: 'Purpose',
    placeholder: 'Select purpose',
    options: purposeOptions,
    variant: 'filled',
    size: 'medium',
  },
};

export const WithoutLabel: Story = {
  render: (args) => <ControlledSelect {...args} />,
  args: {
    placeholder: 'Select an option',
    options: purposeOptions,
    ariaLabel: 'Purpose selector',
    variant: 'outlined',
    size: 'medium',
  },
};

export const ManyOptions: Story = {
  render: (args) => <ControlledSelect {...args} />,
  args: {
    label: 'Choose Option',
    placeholder: 'Select from many options',
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
    })),
    variant: 'outlined',
    size: 'medium',
  },
};

// Demonstration of reusability across different contexts
export const ReusabilityDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <h3>Same Component, Different Contexts</h3>
      
      <ControlledSelect
        label="Farm Purpose"
        placeholder="Select purpose"
        options={purposeOptions}
        helperText="Choose the main purpose for this farm"
      />
      
      <ControlledSelect
        label="Crop Selection"
        placeholder="Select crop type"
        options={cropOptions}
        helperText="Choose what to grow"
      />
      
      <ControlledSelect
        label="System Status"
        placeholder="Select status"
        options={statusOptions}
        helperText="Current operational status"
      />
    </div>
  ),
};
