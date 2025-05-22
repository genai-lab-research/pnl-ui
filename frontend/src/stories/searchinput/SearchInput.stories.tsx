import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from '../../shared/components/ui/SearchInput';

const meta = {
  title: 'Input/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search containers...',
    width: '300px',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search containers...',
    disabled: true,
    width: '300px',
  },
};

// Interactive version with state
export const Interactive = () => {
  const [value, setValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  return (
    <div style={{ width: '300px' }}>
      <SearchInput
        placeholder="Search containers..."
        value={value}
        onChange={setValue}
        onSearch={handleSearch}
      />
      {searchTerm && (
        <div style={{ marginTop: '16px', fontSize: '14px' }}>
          Searched for: <strong>{searchTerm}</strong>
        </div>
      )}
    </div>
  );
};