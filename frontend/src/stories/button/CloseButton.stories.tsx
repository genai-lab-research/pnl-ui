import type { Meta, StoryObj } from '@storybook/react';

import { CloseButton } from '../../shared/components/ui/Button';

const meta: Meta<typeof CloseButton> = {
  title: 'UI/Button/CloseButton',
  component: CloseButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      defaultValue: 'medium',
    },
    disabled: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof CloseButton>;

export const Default: Story = {
  args: {
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
