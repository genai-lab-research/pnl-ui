import type { Meta, StoryObj } from '@storybook/react';

import { AvatarIcon } from '../../shared/components/ui/Icon/AvatarIcon';

const meta: Meta<typeof AvatarIcon> = {
  title: 'Components/Icon/AvatarIcon',
  component: AvatarIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'number' } },
    src: { control: { type: 'text' } },
    alt: { control: { type: 'text' } },
  },
};

export default meta;
type Story = StoryObj<typeof AvatarIcon>;

export const Default: Story = {
  args: {
    size: 32,
    alt: 'User avatar',
  },
};

export const WithImage: Story = {
  args: {
    size: 32,
    src: 'https://i.pravatar.cc/300',
    alt: 'User avatar',
  },
};

export const Large: Story = {
  args: {
    size: 64,
    src: 'https://i.pravatar.cc/300',
    alt: 'User avatar',
  },
};

export const Small: Story = {
  args: {
    size: 24,
    src: 'https://i.pravatar.cc/300',
    alt: 'User avatar',
  },
};
