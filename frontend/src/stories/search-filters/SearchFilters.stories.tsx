import type { Meta, StoryObj } from '@storybook/react';
import { SearchFilters } from '../../shared/components/ui/SearchFilters';

const meta = {
  title: 'UI/SearchFilters',
  component: SearchFilters,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchValue: '',
    types: ['Container', 'Pod', 'Farm'],
    selectedType: 'All types',
    tenants: ['Tenant A', 'Tenant B', 'Tenant C'],
    selectedTenant: 'All tenants',
    purposes: ['Production', 'Research', 'Testing'],
    selectedPurpose: 'All purposes',
    statuses: ['Active', 'Inactive', 'Maintenance'],
    selectedStatus: 'All statuses',
    hasAlerts: false,
  },
};

export const WithValues: Story = {
  args: {
    searchValue: 'container-01',
    types: ['Container', 'Pod', 'Farm'],
    selectedType: 'Container',
    tenants: ['Tenant A', 'Tenant B', 'Tenant C'],
    selectedTenant: 'Tenant A',
    purposes: ['Production', 'Research', 'Testing'],
    selectedPurpose: 'Production',
    statuses: ['Active', 'Inactive', 'Maintenance'],
    selectedStatus: 'Active',
    hasAlerts: true,
  },
};

export const NoFilters: Story = {
  args: {
    searchValue: '',
    types: [],
    selectedType: 'All types',
    tenants: [],
    selectedTenant: 'All tenants',
    purposes: [],
    selectedPurpose: 'All purposes',
    statuses: [],
    selectedStatus: 'All statuses',
    hasAlerts: false,
  },
};