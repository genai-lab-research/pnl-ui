import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterChipContainer } from '../../shared/components/ui/Container';

const meta = {
  title: 'Container/FilterChipContainer',
  component: FilterChipContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterChipContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const typeOptions = [
  { value: 'all', label: 'All types' },
  { value: 'virtual', label: 'Virtual farms' },
  { value: 'container', label: 'Containers' },
];

export const Default: Story = {
  args: {
    label: 'Filter',
    options: typeOptions,
    selectedValue: 'all',
    width: '140px',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Filter',
    options: typeOptions,
    selectedValue: 'all',
    disabled: true,
    width: '140px',
  },
};

// Interactive example with state
export const Interactive = () => {
  const [selected, setSelected] = useState('all');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <FilterChipContainer
        label="Type"
        options={typeOptions}
        selectedValue={selected}
        onChange={setSelected}
        width="140px"
      />
      
      <div style={{ marginTop: '10px', fontSize: '14px' }}>
        Selected: <strong>{selected}</strong>
      </div>
    </div>
  );
};