import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SegmentedToggle } from '../shared/components/ui/SegmentedToggle';
import { SegmentedToggleProps } from '../shared/components/ui/SegmentedToggle/types';

const meta: Meta<typeof SegmentedToggle> = {
  title: 'UI/SegmentedToggle',
  component: SegmentedToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable segmented toggle component for switching between multiple options. Perfect for mode switching, view toggles, or any binary/multi-option selection.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'outlined', 'elevated'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper for stories
const SegmentedToggleWrapper = (args: SegmentedToggleProps) => {
  const [value, setValue] = useState(args.value);
  
  return (
    <SegmentedToggle
      {...args}
      value={value}
      onChange={setValue}
    />
  );
};

// Default Physical/Virtual toggle (matching the original design)
export const PhysicalVirtual: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'Physical', value: 'physical' },
      { id: '2', label: 'Virtual', value: 'virtual' },
    ],
    value: 'physical',
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'This story exactly matches the original Figma design with Physical selected (dark background) and Virtual unselected (transparent background with gray text).'
      }
    }
  }
};

// Alternative with Virtual selected to show the inverse state
export const VirtualSelected: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'Physical', value: 'physical' },
      { id: '2', label: 'Virtual', value: 'virtual' },
    ],
    value: 'virtual',
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with Virtual selected instead of Physical.'
      }
    }
  }
};

// Generic binary toggle
export const ModeToggle: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'Light', value: 'light' },
      { id: '2', label: 'Dark', value: 'dark' },
    ],
    value: 'light',
    variant: 'default',
    size: 'md',
  },
};

// Multiple options
export const ViewSelector: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'List', value: 'list' },
      { id: '2', label: 'Grid', value: 'grid' },
      { id: '3', label: 'Card', value: 'card' },
    ],
    value: 'list',
    variant: 'default',
    size: 'md',
  },
};

// Different sizes
export const SmallSize: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'Physical', value: 'physical' },
      { id: '2', label: 'Virtual', value: 'virtual' },
    ],
    value: 'physical',
    variant: 'default',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'Physical', value: 'physical' },
      { id: '2', label: 'Virtual', value: 'virtual' },
    ],
    value: 'physical',
    variant: 'default',
    size: 'lg',
  },
};

// Different variants
export const OutlinedVariant: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'Physical', value: 'physical' },
      { id: '2', label: 'Virtual', value: 'virtual' },
    ],
    value: 'physical',
    variant: 'outlined',
    size: 'md',
  },
};

export const ElevatedVariant: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'Physical', value: 'physical' },
      { id: '2', label: 'Virtual', value: 'virtual' },
    ],
    value: 'physical',
    variant: 'elevated',
    size: 'md',
  },
};

// States
export const DisabledState: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'Physical', value: 'physical' },
      { id: '2', label: 'Virtual', value: 'virtual' },
    ],
    value: 'physical',
    variant: 'default',
    size: 'md',
    disabled: true,
  },
};

export const LoadingState: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'Physical', value: 'physical' },
      { id: '2', label: 'Virtual', value: 'virtual' },
    ],
    value: 'physical',
    variant: 'default',
    size: 'md',
    loading: true,
  },
};

export const WithError: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'Physical', value: 'physical' },
      { id: '2', label: 'Virtual', value: 'virtual' },
    ],
    value: 'physical',
    variant: 'default',
    size: 'md',
    error: 'Please select a valid option',
  },
};

export const DisabledOption: Story = {
  render: (args) => <SegmentedToggleWrapper {...(args as SegmentedToggleProps)} />,
  args: {
    options: [
      { id: '1', label: 'Available', value: 'available' },
      { id: '2', label: 'Unavailable', value: 'unavailable', disabled: true },
      { id: '3', label: 'Pending', value: 'pending' },
    ],
    value: 'available',
    variant: 'default',
    size: 'md',
  },
};