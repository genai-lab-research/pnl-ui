import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import type { Meta, StoryObj } from '@storybook/react';

import { CustomIconButton } from '../../shared/components/ui/Button';

const meta: Meta<typeof CustomIconButton> = {
  title: 'UI/Button/IconButton',
  component: CustomIconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      defaultValue: 'medium',
    },
    disabled: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    color: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
      defaultValue: 'default',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomIconButton>;

export const Default: Story = {
  args: {
    size: 'medium',
    children: <AddIcon />,
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
    children: <AddIcon />,
  },
};

export const Error: Story = {
  args: {
    color: 'error',
    children: <DeleteIcon />,
  },
};

export const Success: Story = {
  args: {
    color: 'success',
    children: <SaveIcon />,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: <AddIcon />,
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: <AddIcon />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: <AddIcon />,
  },
};
