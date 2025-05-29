import type { Meta, StoryObj } from '@storybook/react';
import ContainerHeader from '../../shared/components/ui/ContainerHeader';

const meta = {
  title: 'Components/ContainerHeader',
  component: ContainerHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    metadata: { control: 'text' },
    status: { 
      control: { type: 'select' }, 
      options: ['active', 'inactive', 'in-progress', 'default'] 
    },
  },
} satisfies Meta<typeof ContainerHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default configuration matching the reference image
export const Default: Story = {
  args: {
    title: 'farm-container-04',
    metadata: 'Physical container | Tenant-123 | Development',
    status: 'active',
  },
};

// Status variants
export const Active: Story = {
  args: {
    ...Default.args,
    status: 'active',
  },
};

export const Inactive: Story = {
  args: {
    ...Default.args,
    status: 'inactive',
  },
};

export const InProgress: Story = {
  args: {
    ...Default.args,
    status: 'in-progress',
  },
};

export const DefaultStatus: Story = {
  args: {
    ...Default.args,
    status: 'default',
  },
};

// Example with long text to demonstrate overflow handling
export const LongText: Story = {
  args: {
    title: 'farm-container-04-with-very-long-title-that-may-overflow',
    metadata: 'Physical container | Tenant-123 | Development | This is a very long metadata text that will be truncated on smaller screens',
    status: 'active',
  },
};