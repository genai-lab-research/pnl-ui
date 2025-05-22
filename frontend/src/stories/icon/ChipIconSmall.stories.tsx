import type { Meta, StoryObj } from '@storybook/react';
import { ChipIconSmall } from '../../shared/components/ui/Icon';

const meta = {
  title: 'UI/Icon/ChipIconSmall',
  component: ChipIconSmall,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof ChipIconSmall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: '#655490',
  },
};

export const Blue: Story = {
  args: {
    color: '#1976D2',
  },
};

export const Green: Story = {
  args: {
    color: '#4CAF50',
  },
};

export const Red: Story = {
  args: {
    color: '#F44336',
  },
};