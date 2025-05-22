import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '../../shared/components/ui/Table';

const meta = {
  title: 'Table/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns = [
  { id: 'type', label: 'Type', width: '60px' },
  { id: 'name', label: 'Name' },
  { id: 'tenant', label: 'Tenant' },
  { id: 'purpose', label: 'Purpose' },
  { id: 'location', label: 'Location' },
  { id: 'status', label: 'Status' },
  { id: 'created', label: 'Created' },
  { id: 'modified', label: 'Modified' },
  { id: 'alerts', label: 'Alerts', align: 'center' as const },
  { id: 'actions', label: 'Actions', width: '80px', align: 'center' as const },
];

const rows = [
  {
    id: '1',
    type: 'virtual-farm',
    name: 'virtual-farm-04',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Agriville, USA',
    status: 'connected',
    created: '30/01/2025',
    modified: '30/01/2025',
    alerts: 1,
  },
  {
    id: '2',
    type: 'virtual-farm',
    name: 'virtual-farm-03',
    tenant: 'tenant-222',
    purpose: 'Research',
    location: 'Farmington, USA',
    status: 'maintenance',
    created: '30/01/2025',
    modified: '30/01/2025',
    alerts: 0,
  },
  {
    id: '3',
    type: 'farm-container',
    name: 'farm-container-04',
    tenant: 'tenant-222',
    purpose: 'Research',
    location: 'Techville, Canada',
    status: 'created',
    created: '25/01/2025',
    modified: '26/01/2025',
    alerts: 0,
  },
  {
    id: '4',
    type: 'farm-container',
    name: 'farm-container-07',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Agriville, USA',
    status: 'connected',
    created: '25/01/2025',
    modified: '26/01/2025',
    alerts: 0,
  },
  {
    id: '5',
    type: 'virtual-farm',
    name: 'virtual-farm-02',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Croptown, USA',
    status: 'inactive',
    created: '13/01/2025',
    modified: '15/01/2025',
    alerts: 1,
  },
  {
    id: '6',
    type: 'farm-container',
    name: 'farm-container-06',
    tenant: 'tenant-5',
    purpose: 'Research',
    location: 'Scienceville, Germany',
    status: 'connected',
    created: '12/01/2025',
    modified: '18/01/2025',
    alerts: 0,
  },
];

export const Default: Story = {
  args: {
    columns,
    rows,
  },
};

export const Empty: Story = {
  args: {
    columns,
    rows: [],
  },
};