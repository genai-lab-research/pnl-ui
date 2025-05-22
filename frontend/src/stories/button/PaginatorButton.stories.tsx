import type { Meta, StoryObj } from '@storybook/react';
import { PaginatorButton } from '../../shared/components/ui/Button';

const meta = {
  title: 'UI/Button/PaginatorButton',
  component: PaginatorButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      options: ['previous', 'next'],
      control: { type: 'radio' },
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof PaginatorButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Previous: Story = {
  args: {
    direction: 'previous',
    disabled: false,
  },
};

export const Next: Story = {
  args: {
    direction: 'next',
    disabled: false,
  },
};

export const DisabledPrevious: Story = {
  args: {
    direction: 'previous',
    disabled: true,
  },
};

export const DisabledNext: Story = {
  args: {
    direction: 'next',
    disabled: true,
  },
};