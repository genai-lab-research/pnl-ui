import type { Meta, StoryObj } from '@storybook/react';
import { PurposeSelect } from '../../shared/components/ui/PurposeSelect';

const meta = {
  title: 'Components/PurposeSelect',
  component: PurposeSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    width: { control: 'text' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof PurposeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Purpose',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Research',
    placeholder: 'Purpose',
  },
};

export const CustomWidth: Story = {
  args: {
    placeholder: 'Purpose',
    width: '500px',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Purpose',
    disabled: true,
  },
};