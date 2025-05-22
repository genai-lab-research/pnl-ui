import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChipGroupContainer } from '../../shared/components/ui/Container';

const meta = {
  title: 'Container/ChipGroupContainer',
  component: ChipGroupContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChipGroupContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample filter groups
const defaultFilterGroups = [
  {
    id: 'type',
    label: 'Type',
    options: [
      { value: 'all', label: 'All types' },
      { value: 'virtual', label: 'Virtual farms' },
      { value: 'container', label: 'Containers' },
    ],
    selectedValue: 'all',
  },
  {
    id: 'tenant',
    label: 'Tenant',
    options: [
      { value: 'all', label: 'All tenants' },
      { value: 'tenant-123', label: 'Tenant 123' },
      { value: 'tenant-222', label: 'Tenant 222' },
      { value: 'tenant-5', label: 'Tenant 5' },
    ],
    selectedValue: 'all',
  },
  {
    id: 'purpose',
    label: 'Purpose',
    options: [
      { value: 'all', label: 'All purposes' },
      { value: 'development', label: 'Development' },
      { value: 'research', label: 'Research' },
      { value: 'production', label: 'Production' },
    ],
    selectedValue: 'all',
  },
  {
    id: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All statuses' },
      { value: 'connected', label: 'Connected' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'inactive', label: 'Inactive' },
    ],
    selectedValue: 'all',
  },
];

export const Default: Story = {
  args: {
    filterGroups: defaultFilterGroups,
    chipWidth: '140px',
  },
};

export const WithDisabledFilter: Story = {
  args: {
    filterGroups: [
      ...defaultFilterGroups.slice(0, 2),
      {
        ...defaultFilterGroups[2],
        disabled: true,
      },
      defaultFilterGroups[3],
    ],
    chipWidth: '140px',
  },
};

// Interactive example with state management
export const Interactive = () => {
  const [filterGroups, setFilterGroups] = useState(defaultFilterGroups);
  
  const handleFilterChange = (groupId: string, value: string) => {
    setFilterGroups(
      filterGroups.map((group) =>
        group.id === groupId ? { ...group, selectedValue: value } : group
      )
    );
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ChipGroupContainer
        filterGroups={filterGroups}
        onFilterChange={handleFilterChange}
        chipWidth="140px"
      />
      
      <div style={{ 
        marginTop: '20px', 
        padding: '10px',
        backgroundColor: '#f5f5f5', 
        borderRadius: '4px',
        fontSize: '14px' 
      }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Current Filter Values:</h4>
        <pre style={{ margin: 0 }}>
          {JSON.stringify(
            Object.fromEntries(
              filterGroups.map(group => [group.id, group.selectedValue])
            ), 
            null, 2
          )}
        </pre>
      </div>
    </div>
  );
};