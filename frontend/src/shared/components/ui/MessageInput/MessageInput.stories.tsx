import type { Meta, StoryObj } from '@storybook/react';
import { MessageInput } from './MessageInput';

const meta = {
  title: 'Components/MessageInput',
  component: MessageInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    onSendMessage: { action: 'message sent' },
    onAttachmentClick: { action: 'attachment clicked' },
    onVoiceInputClick: { action: 'voice input clicked' },
  },
} satisfies Meta<typeof MessageInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Send a message...',
  },
};