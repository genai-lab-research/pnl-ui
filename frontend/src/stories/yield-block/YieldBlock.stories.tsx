import type { Meta, StoryObj } from '@storybook/react';
import { YieldBlock } from '../../shared/components/ui/YieldBlock';

const meta = {
  title: 'UI/YieldBlock',
  component: YieldBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    increment: { control: 'text' },
  },
} satisfies Meta<typeof YieldBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Yield',
    value: '51KG',
    increment: '+1.5Kg',
  },
};

export const WithoutIncrement: Story = {
  args: {
    label: 'Yield',
    value: '51KG',
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'Production',
    value: '51KG',
    increment: '+1.5Kg',
  },
};