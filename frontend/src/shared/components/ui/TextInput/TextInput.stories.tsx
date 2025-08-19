import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextInput } from './TextInput';
import { TextInputProps } from './types';

const meta: Meta<typeof TextInput> = {
  title: 'UI/TextInput',
  component: TextInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A reusable text input component with consistent styling and behavior.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    onChange: { action: 'changed' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextInput>;

// Basic story template with state
const Template = (args: TextInputProps) => {
  const [value, setValue] = useState(args.value || '');
  
  return (
    <TextInput
      {...args}
      value={value}
      onChange={setValue}
    />
  );
};

export const Default: Story = {
  render: Template,
  args: {
    label: 'Notes (optional)',
    placeholder: 'Enter your notes...',
    size: 'md',
    variant: 'default',
  },
};

export const WithValue: Story = {
  render: Template,
  args: {
    label: 'Description',
    value: 'Some initial text content',
    placeholder: 'Enter description...',
  },
};

export const Required: Story = {
  render: Template,
  args: {
    label: 'Name',
    placeholder: 'Enter your name...',
    required: true,
  },
};

export const WithError: Story = {
  render: Template,
  args: {
    label: 'Email',
    placeholder: 'Enter your email...',
    type: 'email',
    error: 'Please enter a valid email address',
    value: 'invalid-email',
  },
};

export const WithHelperText: Story = {
  render: Template,
  args: {
    label: 'Username',
    placeholder: 'Enter username...',
    helperText: 'Username must be at least 3 characters long',
  },
};

export const WithCharacterCount: Story = {
  render: Template,
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    maxLength: 150,
    showCharCount: true,
    helperText: 'Brief description for your profile',
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    label: 'Disabled Field',
    value: 'This field is disabled',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TextInput label="Small" placeholder="Small input..." size="sm" />
      <TextInput label="Medium" placeholder="Medium input..." size="md" />
      <TextInput label="Large" placeholder="Large input..." size="lg" />
    </div>
  ),
};

export const DifferentTypes: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [url, setUrl] = useState('');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextInput 
          label="Email" 
          type="email" 
          placeholder="Enter email..." 
          value={email}
          onChange={setEmail}
        />
        <TextInput 
          label="Password" 
          type="password" 
          placeholder="Enter password..." 
          value={password}
          onChange={setPassword}
        />
        <TextInput 
          label="Phone" 
          type="tel" 
          placeholder="Enter phone number..." 
          value={phone}
          onChange={setPhone}
        />
        <TextInput 
          label="Website" 
          type="url" 
          placeholder="Enter website URL..." 
          value={url}
          onChange={setUrl}
        />
      </div>
    );
  },
};

export const ValidationStates: Story = {
  render: () => {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('invalid@');
    const [value3, setValue3] = useState('Valid input');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextInput 
          label="Normal State" 
          placeholder="Enter text..." 
          value={value1}
          onChange={setValue1}
          helperText="This is helper text"
        />
        <TextInput 
          label="Error State" 
          type="email"
          placeholder="Enter email..." 
          value={value2}
          onChange={setValue2}
          error="Please enter a valid email address"
        />
        <TextInput 
          label="Success State" 
          placeholder="Enter text..." 
          value={value3}
          onChange={setValue3}
          helperText="Looks good!"
        />
      </div>
    );
  },
};
