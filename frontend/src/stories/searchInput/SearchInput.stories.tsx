import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchInput } from '../../shared/components/ui/SearchInput';

/**
 * The `SearchInput` component provides a search input field with a search icon that matches the design from Figma.
 * It's built on top of Material UI's InputBase component and follows Material Design guidelines.
 */
const meta = {
  title: 'UI/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    value: {
      control: 'text',
      description: 'The value of the search input',
    },
    onChange: {
      action: 'changed',
      description: 'Function called when the search input value changes',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the search input is disabled',
    },
    className: {
      control: 'text',
      description: 'Custom CSS class name for styling',
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default example of the SearchInput component.
 */
export const Default: Story = {
  args: {
    placeholder: 'All types',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '240px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * SearchInput component with a predefined value.
 */
export const WithValue: Story = {
  args: {
    placeholder: 'All types',
    value: 'Type filter',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '240px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * SearchInput component in a disabled state.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'All types',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '240px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Example showing how to use the SearchInput component with state.
 */
export const Interactive = () => {
  const [value, setValue] = useState('');

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <div style={{ width: '240px' }}>
      <SearchInput
        placeholder="All types"
        value={value}
        onChange={handleChange}
      />
      <div style={{ marginTop: '10px', fontSize: '14px' }}>
        Current value: {value || '(empty)'}
      </div>
    </div>
  );
};

/**
 * Example showing the SearchInput component with a custom placeholder.
 */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Search types...',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '240px' }}>
        <Story />
      </div>
    ),
  ],
};