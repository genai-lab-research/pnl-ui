import type { Meta, StoryObj } from '@storybook/react';
import { TabLabel } from '../../shared/components/ui/Typography';

const meta = {
  title: 'UI/Typography/TabLabel',
  component: TabLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
  },
} satisfies Meta<typeof TabLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Tab Label',
    active: false,
  },
};

export const Active: Story = {
  args: {
    children: 'Active Tab',
    active: true,
  },
};