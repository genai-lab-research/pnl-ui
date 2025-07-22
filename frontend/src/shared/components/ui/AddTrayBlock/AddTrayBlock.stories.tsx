import type { Meta, StoryObj } from '@storybook/react';
import { AddTrayBlock } from './AddTrayBlock';

const meta = {
  title: 'Components/AddTrayBlock',
  component: AddTrayBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    slotNumber: { control: 'text' },
    onAddTrayClick: { action: 'clicked' },
  },
} satisfies Meta<typeof AddTrayBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    slotNumber: 5,
  },
};

export const CustomSlot: Story = {
  args: {
    slotNumber: 10,
  },
};