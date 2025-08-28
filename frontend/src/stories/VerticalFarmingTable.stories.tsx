import type { Meta, StoryObj } from '@storybook/react';
import { VerticalFarmingTable } from '../shared/components/ui/VerticalFarmingTable';
import { TableRow } from '../shared/components/ui/VerticalFarmingTable/types';

const mockData: TableRow[] = [
  {
    id: '1',
    type: 'container',
    name: 'farm-container-07',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Agriville, USA',
    status: 'Active',
    created: '25/01/2025',
    modified: '26/01/2025',
    hasAlert: false
  },
  {
    id: '2',
    type: 'virtual',
    name: 'virtual-farm-04',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Agriville, USA',
    status: 'Active',
    created: '30/01/2025',
    modified: '30/01/2025',
    hasAlert: true
  },
  {
    id: '3',
    type: 'container',
    name: 'farm-container-06',
    tenant: 'tenant-5',
    purpose: 'Research',
    location: 'Scienceville, Germany',
    status: 'Active',
    created: '12/01/2025',
    modified: '18/01/2025',
    hasAlert: false
  },
  {
    id: '4',
    type: 'virtual',
    name: 'virtual-farm-02',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Croptown, USA',
    status: 'Inactive',
    created: '13/01/2025',
    modified: '15/01/2025',
    hasAlert: true
  },
  {
    id: '5',
    type: 'container',
    name: 'farm-container-04',
    tenant: 'tenant-222',
    purpose: 'Research',
    location: 'Techville, Canada',
    status: 'Created',
    created: '25/01/2025',
    modified: '26/01/2025',
    hasAlert: false
  },
  {
    id: '6',
    type: 'virtual',
    name: 'virtual-farm-03',
    tenant: 'tenant-222',
    purpose: 'Research',
    location: 'Farmington, USA',
    status: 'Maintenance',
    created: '30/01/2025',
    modified: '30/01/2025',
    hasAlert: false
  }
];

const meta: Meta<typeof VerticalFarmingTable> = {
  title: 'Components/VerticalFarmingTable',
  component: VerticalFarmingTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive data table for the Vertical Farming Control Panel showing farm containers and virtual farms with their metadata.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of table row data',
      control: { type: 'object' },
    },
    onRowAction: {
      description: 'Callback function for row actions',
      action: 'onRowAction',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockData,
    onRowAction: (rowId: string, action: string) => {
      console.log(`Action ${action} on row ${rowId}`);
    },
  },
};

export const Empty: Story = {
  args: {
    data: [],
    onRowAction: (rowId: string, action: string) => {
      console.log(`Action ${action} on row ${rowId}`);
    },
  },
};

export const SingleRow: Story = {
  args: {
    data: [mockData[0]],
    onRowAction: (rowId: string, action: string) => {
      console.log(`Action ${action} on row ${rowId}`);
    },
  },
};

export const WithMixedStatuses: Story = {
  args: {
    data: [
      { ...mockData[0], status: 'Active' },
      { ...mockData[1], status: 'Inactive' },
      { ...mockData[2], status: 'Created' },
      { ...mockData[3], status: 'Maintenance' },
    ],
    onRowAction: (rowId: string, action: string) => {
      console.log(`Action ${action} on row ${rowId}`);
    },
  },
};