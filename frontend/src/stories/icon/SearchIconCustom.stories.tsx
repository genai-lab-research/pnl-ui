import type { Meta, StoryObj } from '@storybook/react';

import { SearchIconCustom } from '../../shared/components/ui/Icon';

const meta = {
  title: 'UI/Icon/SearchIconCustom',
  component: SearchIconCustom,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
    color: { control: 'color' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof SearchIconCustom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'medium',
    color: '#717179',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    color: '#717179',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    color: '#717179',
  },
};

export const Colored: Story = {
  args: {
    size: 'medium',
    color: '#1976D2',
  },
};
