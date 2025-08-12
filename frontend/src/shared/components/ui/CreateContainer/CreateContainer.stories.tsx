import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CreateContainer } from './CreateContainer';

const meta = {
  title: 'UI/CreateContainer',
  component: CreateContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A specialized button component for creating new containers with a clean, minimal design.

## Features
- Clean outline style with plus icon
- Loading state with spinner animation
- Disabled state support
- Custom text option
- Full keyboard navigation and accessibility
- Proper button type attribute support
- Responsive hover and focus states

## Usage
Perfect for interfaces where users need to create new container instances, add items to lists, or initiate creation workflows.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: { type: 'text' },
      description: 'Button text (defaults to "Create Container")',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'ARIA label for accessibility',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof CreateContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state
export const Default: Story = {
  args: {
    'aria-label': 'Create a new container',
  },
};

// Custom text
export const CustomText: Story = {
  args: {
    text: 'Add New Item',
    'aria-label': 'Add a new item',
  },
};

// Loading state
export const Loading: Story = {
  args: {
    loading: true,
    'aria-label': 'Creating container',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Create container (disabled)',
  },
};

// Submit button type
export const SubmitButton: Story = {
  args: {
    type: 'submit',
    'aria-label': 'Submit to create container',
  },
};

// Short text
export const ShortText: Story = {
  args: {
    text: 'New',
    'aria-label': 'Create new',
  },
};

// Long text
export const LongText: Story = {
  args: {
    text: 'Create New Container Instance',
    'aria-label': 'Create a new container instance',
  },
};

// Interactive states showcase
export const InteractiveStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <CreateContainer aria-label="Default state" />
      <CreateContainer loading aria-label="Loading state" />
      <CreateContainer disabled aria-label="Disabled state" />
    </div>
  ),
};

// Different text variations
export const TextVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <CreateContainer text="Create Container" aria-label="Create container" />
      <CreateContainer text="Add New" aria-label="Add new item" />
      <CreateContainer text="New Instance" aria-label="Create new instance" />
      <CreateContainer text="+" aria-label="Add" />
    </div>
  ),
};

// Form integration example
export const FormIntegration: Story = {
  render: () => (
    <form onSubmit={(e) => { e.preventDefault(); console.log('Form submitted'); }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
        <input 
          type="text" 
          placeholder="Container name" 
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #D1D5DB', 
            borderRadius: '4px' 
          }} 
        />
        <input 
          type="text" 
          placeholder="Description" 
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #D1D5DB', 
            borderRadius: '4px' 
          }} 
        />
        <CreateContainer type="submit" aria-label="Submit form to create container" />
      </div>
    </form>
  ),
};

// Dark background example
export const OnDarkBackground: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div style={{ padding: '40px' }}>
      <CreateContainer aria-label="Create container on dark background" />
    </div>
  ),
};

// Real-world usage example
export const RealWorldExample: Story = {
  render: () => (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#F9FAFB',
      borderRadius: '8px',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px'
    }}>
      <p style={{ 
        color: '#6B7280', 
        fontSize: '14px',
        margin: 0
      }}>
        No containers found
      </p>
      <CreateContainer 
        text="Create your first container" 
        aria-label="Create your first container"
      />
    </div>
  ),
};