import type { Meta, StoryObj } from '@storybook/react';
import { UserAvatar } from '../../shared/components/ui/UserAvatar';

// Default metadata for the UserAvatar component stories
const meta = {
  title: 'UI/UserAvatar',
  component: UserAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'number', min: 16, max: 128, step: 8 } },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample profile image URL (using a placeholder image)
const placeholderImage = 'https://via.placeholder.com/150';

// Default story configuration
export const Default: Story = {
  args: {
    src: placeholderImage,
    alt: 'User profile',
    size: 32,
  },
};

// Larger size variation
export const Large: Story = {
  args: {
    src: placeholderImage,
    alt: 'User profile',
    size: 64,
  },
};

// Small size variation
export const Small: Story = {
  args: {
    src: placeholderImage,
    alt: 'User profile',
    size: 24,
  },
};