import type { Meta, StoryObj } from '@storybook/react';
import { CancelIcon } from '../../shared/components/ui/Icon/CancelIcon';

const meta: Meta<typeof CancelIcon> = {
  title: 'Components/Icon/CancelIcon',
  component: CancelIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fontSize: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'inherit'],
      defaultValue: 'medium',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success', 'inherit'],
      defaultValue: 'inherit',
    },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof CancelIcon>;

export const Default: Story = {
  args: {
    fontSize: 'medium',
  },
};

export const Small: Story = {
  args: {
    fontSize: 'small',
  },
};

export const Large: Story = {
  args: {
    fontSize: 'large',
  },
};

export const Colored: Story = {
  args: {
    fontSize: 'large',
    color: 'error',
  },
};

export const CustomStyles: Story = {
  args: {
    sx: { 
      color: '#F44336',
      fontSize: 40
    },
  },
};