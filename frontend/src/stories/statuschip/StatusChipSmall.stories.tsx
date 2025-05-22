import type { Meta, StoryObj } from '@storybook/react';
import { StatusChipSmall } from '../../shared/components/ui/StatusChip';
import { Stack } from '@mui/material';

const meta: Meta<typeof StatusChipSmall> = {
  title: 'UI/StatusChip/StatusChipSmall',
  component: StatusChipSmall,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['active', 'inactive', 'maintenance', 'error', 'warning'],
      defaultValue: 'active',
    },
    label: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusChipSmall>;

export const Active: Story = {
  args: {
    status: 'active',
  },
};

export const Inactive: Story = {
  args: {
    status: 'inactive',
  },
};

export const Maintenance: Story = {
  args: {
    status: 'maintenance',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
  },
};

export const Warning: Story = {
  args: {
    status: 'warning',
  },
};

export const CustomLabel: Story = {
  args: {
    status: 'active',
    label: 'Online',
  },
};

// StatusChip Group Example
const StatusChipGroupExample = () => {
  return (
    <Stack direction="row" spacing={2}>
      <StatusChipSmall status="active" />
      <StatusChipSmall status="inactive" />
      <StatusChipSmall status="maintenance" />
      <StatusChipSmall status="error" />
      <StatusChipSmall status="warning" />
    </Stack>
  );
};

export const AllStatusChips: Story = {
  render: () => <StatusChipGroupExample />,
};