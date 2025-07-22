import type { Meta, StoryObj } from '@storybook/react';
import { StatusChip, StatusType } from './StatusChip';
import { Box } from '@mui/material';

const meta: Meta<typeof StatusChip> = {
  title: 'UI/StatusChip',
  component: StatusChip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['Connected', 'Maintenance', 'Created', 'Inactive'],
      description: 'Status type for the chip',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size of the chip',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'Connected',
    size: 'small',
  },
};

export const Connected: Story = {
  args: {
    status: 'Connected',
  },
};

export const Maintenance: Story = {
  args: {
    status: 'Maintenance',
  },
};

export const Created: Story = {
  args: {
    status: 'Created',
  },
};

export const Inactive: Story = {
  args: {
    status: 'Inactive',
  },
};

export const AllStatuses: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {(['Connected', 'Maintenance', 'Created', 'Inactive'] as StatusType[]).map((status) => (
        <StatusChip key={status} status={status} />
      ))}
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <StatusChip status="Connected" size="small" />
        <span>Small</span>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <StatusChip status="Connected" size="medium" />
        <span>Medium</span>
      </Box>
    </Box>
  ),
};