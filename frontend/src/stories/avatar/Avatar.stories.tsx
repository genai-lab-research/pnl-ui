import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../shared/components/ui/Avatar';

// Default metadata for the Avatar component stories
const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample profile image URL (using a placeholder image)
const placeholderImage = 'https://via.placeholder.com/150';

// Default story configuration
export const Default: Story = {
  args: {
    src: placeholderImage,
    alt: 'User profile',
  },
};