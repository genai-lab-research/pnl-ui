import type { Meta, StoryObj } from '@storybook/react';
import { ChatHeader } from '../ChatHeader';

const meta: Meta<typeof ChatHeader> = {
  title: 'UI/ChatHeader',
  component: ChatHeader,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The title text displayed in the header',
    },
    showBotIcon: {
      control: 'boolean',
      description: 'Whether to show the bot icon',
    },
    onMinimize: {
      action: 'minimize clicked',
      description: 'Callback when minimize button is clicked',
    },
    onClose: {
      action: 'close clicked',
      description: 'Callback when close button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Talk2DB',
    showBotIcon: true,
    onMinimize: () => console.log('Minimize clicked'),
    onClose: () => console.log('Close clicked'),
  },
};

export const WithoutBotIcon: Story = {
  args: {
    title: 'Talk2DB',
    showBotIcon: false,
    onMinimize: () => console.log('Minimize clicked'),
    onClose: () => console.log('Close clicked'),
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Custom Chat Application',
    showBotIcon: true,
    onMinimize: () => console.log('Minimize clicked'),
    onClose: () => console.log('Close clicked'),
  },
};

export const OnlyCloseButton: Story = {
  args: {
    title: 'Talk2DB',
    showBotIcon: true,
    onClose: () => console.log('Close clicked'),
  },
};

export const OnlyMinimizeButton: Story = {
  args: {
    title: 'Talk2DB',
    showBotIcon: true,
    onMinimize: () => console.log('Minimize clicked'),
  },
};

export const NoButtons: Story = {
  args: {
    title: 'Talk2DB',
    showBotIcon: true,
  },
};