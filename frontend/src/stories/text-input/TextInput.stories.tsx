import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from '../../shared/components/ui/TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    value: { control: 'text' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    placeholder: 'Notes (optional)',
  },
};

export const Filled: Story = {
  args: {
    placeholder: 'Notes (optional)',
    value: 'Sample input text',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Notes (optional)',
    disabled: true,
  },
};
