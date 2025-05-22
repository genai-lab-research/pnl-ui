import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../shared/components/ui/Button';

const meta = {
  title: 'UI/Button/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    variant: {
      options: ['primary', 'secondary', 'outlined'],
      control: { type: 'select' },
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Button',
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
    variant: 'secondary',
    size: 'medium',
    disabled: false,
  },
};

export const Outlined: Story = {
  args: {
    label: 'Button',
    variant: 'outlined',
    size: 'medium',
    disabled: false,
  },
};

export const Small: Story = {
  args: {
    label: 'Small Button',
    variant: 'primary',
    size: 'small',
    disabled: false,
  },
};

export const Large: Story = {
  args: {
    label: 'Large Button',
    variant: 'primary',
    size: 'large',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    variant: 'primary',
    size: 'medium',
    disabled: true,
  },
};