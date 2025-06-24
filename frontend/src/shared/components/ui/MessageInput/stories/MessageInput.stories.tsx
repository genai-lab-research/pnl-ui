import type { Meta, StoryObj } from '@storybook/react';
import { MessageInput } from '../MessageInput';

const meta = {
  title: 'UI/MessageInput',
  component: MessageInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input field',
    },
    value: {
      control: 'text',
      description: 'Controlled value of the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    onChange: {
      description: 'Called when the input value changes',
    },
    onSend: {
      description: 'Called when the send button is clicked or Enter is pressed',
    },
    onAttachmentClick: {
      description: 'Called when the attachment button is clicked',
    },
    onVoiceClick: {
      description: 'Called when the voice button is clicked',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '879px', padding: '20px', background: '#f0f0f0' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Type your message',
    value: 'Hello, this is a pre-filled message',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Type your message',
    disabled: true,
  },
};

export const WithHandlers: Story = {
  args: {
    placeholder: 'Type your message',
    onSend: (message) => {
      console.log('Message sent:', message);
      alert(`Message sent: ${message}`);
    },
    onAttachmentClick: () => {
      console.log('Attachment clicked');
      alert('Attachment button clicked');
    },
    onVoiceClick: () => {
      console.log('Voice clicked');
      alert('Voice button clicked');
    },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Ask me anything...',
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const [messages, setMessages] = React.useState<string[]>([]);

    const handleSend = (message: string) => {
      setMessages([...messages, message]);
      setValue('');
    };

    return (
      <div>
        <div style={{ marginBottom: '20px', minHeight: '100px' }}>
          <h4>Messages:</h4>
          {messages.map((msg, index) => (
            <div key={index} style={{ padding: '5px 0' }}>
              {msg}
            </div>
          ))}
        </div>
        <MessageInput
          value={value}
          onChange={setValue}
          onSend={handleSend}
          onAttachmentClick={() => console.log('Attachment clicked')}
          onVoiceClick={() => console.log('Voice clicked')}
        />
      </div>
    );
  },
};

import React from 'react';