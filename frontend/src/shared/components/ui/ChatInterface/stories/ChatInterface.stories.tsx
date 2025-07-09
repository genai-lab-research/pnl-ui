import type { Meta, StoryObj } from '@storybook/react';
import { ChatInterface } from '../ChatInterface';
import { Message } from '../types';

const meta = {
  title: 'UI/ChatInterface',
  component: ChatInterface,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onSendMessage: { action: 'send message' },
    onClose: { action: 'close' },
    onMinimize: { action: 'minimize' },
  },
} satisfies Meta<typeof ChatInterface>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMessages: Message[] = [
  {
    id: '1',
    content: 'How do seed types compare in: cycle time (days), accumulated light hours and yield (kg/m²)? Use babble chart.',
    timestamp: '5 min ago',
    type: 'user'
  },
  {
    id: '2',
    content: '',
    timestamp: '',
    type: 'bot',
    isTyping: true
  }
];

export const Default: Story = {
  args: {
    title: 'Talk2DB',
    messages: sampleMessages
  },
};

export const Empty: Story = {
  args: {
    title: 'Talk2DB',
    messages: []
  },
};

export const Conversation: Story = {
  args: {
    title: 'Talk2DB',
    messages: [
      {
        id: '1',
        content: 'How do seed types compare in: cycle time (days), accumulated light hours and yield (kg/m²)?',
        timestamp: '10 min ago',
        type: 'user'
      },
      {
        id: '2',
        content: 'I\'ll analyze the seed type comparisons for you based on cycle time, accumulated light hours, and yield. Let me generate a bubble chart to visualize this data.',
        timestamp: '10 min ago',
        type: 'bot'
      },
      {
        id: '3',
        content: 'Can you also include the cost analysis?',
        timestamp: '5 min ago',
        type: 'user'
      },
      {
        id: '4',
        content: '',
        timestamp: '',
        type: 'bot',
        isTyping: true
      }
    ]
  },
};