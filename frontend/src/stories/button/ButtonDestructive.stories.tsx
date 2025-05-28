import type { Meta, StoryObj } from '@storybook/react';

import { ButtonDestructive } from '../../shared/components/ui/Button';

const meta: Meta<typeof ButtonDestructive> = {
  title: 'UI/Button/ButtonDestructive',
  component: ButtonDestructive,
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
    fullWidth: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    rounded: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonDestructive>;

export const Default: Story = {
  args: {
    children: 'Destructive Button',
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const Rounded: Story = {
  args: {
    children: 'Rounded Button',
    rounded: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
};
