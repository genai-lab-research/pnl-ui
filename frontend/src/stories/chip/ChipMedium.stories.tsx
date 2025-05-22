import type { Meta, StoryObj } from '@storybook/react';
import { ChipMedium } from '../../shared/components/ui/Chip/ChipMedium';
import BuildIcon from '@mui/icons-material/Build';
import EditIcon from '@mui/icons-material/Edit';

const meta = {
  title: 'UI/Chip/ChipMedium',
  component: ChipMedium,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: [
        'default', 
        'primary', 
        'secondary',
        'success', 
        'warning', 
        'error', 
        'info', 
        'maintenance'
      ],
      control: { type: 'select' },
    },
    label: { control: 'text' },
    onClick: { action: 'clicked' },
    onDelete: { action: 'deleted' },
  },
} satisfies Meta<typeof ChipMedium>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Chip',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary',
    variant: 'primary',
  },
};

export const Success: Story = {
  args: {
    label: 'Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    label: 'Error',
    variant: 'error',
  },
};

export const Maintenance: Story = {
  args: {
    label: 'Maintenance',
    variant: 'maintenance',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Maintenance',
    variant: 'maintenance',
    icon: <BuildIcon fontSize="small" />,
  },
};

export const WithEditIcon: Story = {
  args: {
    label: 'Edit',
    variant: 'primary',
    icon: <EditIcon fontSize="small" />,
  },
};

export const Clickable: Story = {
  args: {
    label: 'Click me',
    variant: 'primary',
    onClick: undefined, // Will be handled by the action
  },
};

export const Deletable: Story = {
  args: {
    label: 'Delete me',
    variant: 'error',
    onDelete: undefined, // Will be handled by the action
  },
};