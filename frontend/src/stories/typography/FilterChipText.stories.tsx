import type { Meta, StoryObj } from '@storybook/react';
import { FilterChipText } from '../../shared/components/ui/Typography';

const meta = {
  title: 'UI/Typography/FilterChipText',
  component: FilterChipText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
  },
} satisfies Meta<typeof FilterChipText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Filter',
    active: false,
  },
};

export const Active: Story = {
  args: {
    children: 'Active Filter',
    active: true,
  },
};