import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchFilterSectionContainer } from '../../shared/components/ui/Container';

const meta = {
  title: 'Container/SearchFilterSectionContainer',
  component: SearchFilterSectionContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchFilterSectionContainer>;

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

// For static stories
export const Default: Story = {
  args: {
    searchPlaceholder: 'Search containers...',
    filterGroups: defaultFilterGroups,
    toggleFilters: [
      {
        id: 'alerts',
        label: 'Has Alerts',
        checked: false,
        onChange: () => {},
      },
    ],
    onClearFilters: () => {},
  },
};

export const WithoutToggle: Story = {
  args: {
    searchPlaceholder: 'Search containers...',
    filterGroups: defaultFilterGroups,
    onClearFilters: () => {},
  },
};

export const Disabled: Story = {
  args: {
    searchPlaceholder: 'Search containers...',
    filterGroups: defaultFilterGroups,
    toggleFilters: [
      {
        id: 'alerts',
        label: 'Has Alerts',
        checked: true,
        onChange: () => {},
      },
    ],
    onClearFilters: () => {},
    disabled: true,
  },
};

// Interactive version with state management
export const Interactive = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterGroups, setFilterGroups] = useState(defaultFilterGroups);
  const [hasAlerts, setHasAlerts] = useState(false);
  
  const handleFilterChange = (groupId: string, value: string) => {
    setFilterGroups(
      filterGroups.map((group) =>
        group.id === groupId ? { ...group, selectedValue: value } : group
      )
    );
  };
  
  const handleClearFilters = () => {
    setSearchValue('');
    setFilterGroups(
      filterGroups.map((group) => ({
        ...group,
        selectedValue: 'all',
      }))
    );
    setHasAlerts(false);
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SearchFilterSectionContainer
        searchPlaceholder="Search containers..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterGroups={filterGroups}
        onFilterChange={handleFilterChange}
        toggleFilters={[
          {
            id: 'alerts',
            label: 'Has Alerts',
            checked: hasAlerts,
            onChange: setHasAlerts,
          },
        ]}
        onClearFilters={handleClearFilters}
      />
      
      <div style={{ 
        marginTop: '20px', 
        padding: '10px',
        backgroundColor: '#f5f5f5', 
        borderRadius: '4px',
        fontSize: '14px' 
      }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Current Filter State:</h4>
        <pre style={{ margin: 0 }}>
          {JSON.stringify({
            search: searchValue,
            filters: Object.fromEntries(
              filterGroups.map(group => [group.id, group.selectedValue])
            ),
            hasAlerts,
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};