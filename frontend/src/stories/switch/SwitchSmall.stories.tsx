import type { Meta, StoryObj } from '@storybook/react';

import { SwitchSmall } from '../../shared/components/ui/Switch';

const meta = {
  title: 'UI/Switch/SwitchSmall',
  component: SwitchSmall,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    labelPosition: {
      options: ['left', 'right'],
      control: { type: 'radio' },
    },
  },
} satisfies Meta<typeof SwitchSmall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const WithLabelRight: Story = {
  args: {
    checked: false,
    label: 'Switch Label',
    labelPosition: 'right',
  },
};

export const WithLabelLeft: Story = {
  args: {
    checked: false,
    label: 'Switch Label',
    labelPosition: 'left',
  },
};
