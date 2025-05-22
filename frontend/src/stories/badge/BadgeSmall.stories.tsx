import type { Meta, StoryObj } from '@storybook/react';
import { BadgeSmall } from '../../shared/components/ui/Badge';

const meta = {
  title: 'UI/Badge/BadgeSmall',
  component: BadgeSmall,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
      control: { type: 'select' },
    },
    children: { control: 'text' },
  },
} satisfies Meta<typeof BadgeSmall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'BADGE',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    children: 'PRIMARY',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'SECONDARY',
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    children: 'SUCCESS',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'WARNING',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'ERROR',
    variant: 'error',
  },
};

export const Info: Story = {
  args: {
    children: 'INFO',
    variant: 'info',
  },
};

export const Prod: Story = {
  args: {
    children: 'PROD',
    variant: 'default',
  },
};