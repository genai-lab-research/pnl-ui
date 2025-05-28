import type { Meta, StoryObj } from '@storybook/react';

import { LabelSmall } from '../../shared/components/ui/Typography';

const meta = {
  title: 'UI/Typography/LabelSmall',
  component: LabelSmall,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      options: ['default', 'primary', 'secondary', 'muted', 'error', 'success'],
      control: { type: 'select' },
    },
    required: { control: 'boolean' },
    htmlFor: { control: 'text' },
  },
} satisfies Meta<typeof LabelSmall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Form Field Label',
    color: 'default',
    required: false,
  },
};

export const Required: Story = {
  args: {
    children: 'Required Field',
    color: 'default',
    required: true,
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary Color Label',
    color: 'primary',
  },
};

export const Error: Story = {
  args: {
    children: 'Error Label',
    color: 'error',
  },
};
