import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'UI/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    logoText: {
      control: 'text',
      description: 'Text to display as logo',
    },
    userAvatarSrc: {
      control: 'text',
      description: 'URL for user avatar image',
    },
    userName: {
      control: 'text',
      description: 'User name for avatar fallback',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logoText: 'Control Panel',
    userName: 'John Doe',
  },
};

export const WithAvatar: Story = {
  args: {
    logoText: 'Control Panel',
    userAvatarSrc: 'https://i.pravatar.cc/150?img=1',
    userName: 'John Doe',
  },
};

export const CustomLogo: Story = {
  args: {
    logoText: 'Dashboard Pro',
    userName: 'Jane Smith',
  },
};