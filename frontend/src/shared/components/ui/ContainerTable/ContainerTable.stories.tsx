import type { Meta, StoryObj } from '@storybook/react';
import { ContainerTable } from './ContainerTable';
import { Container } from '../../../types/containers';

const mockContainers: Container[] = [
  {
    id: '1',
    type: 'virtual',
    name: 'virtual-farm-04',
    tenant: 'tenant-123',
    purpose: 'development',
    location: { city: 'Agriville', country: 'USA' },
    status: 'connected',
    created: '2025-01-30T00:00:00Z',
    modified: '2025-01-30T00:00:00Z',
    has_alert: true,
    shadow_service_enabled: true,
    ecosystem_connected: true,
  },
  {
    id: '2',
    type: 'virtual',
    name: 'virtual-farm-03',
    tenant: 'tenant-222',
    purpose: 'research',
    location: { city: 'Farmington', country: 'USA' },
    status: 'maintenance',
    created: '2025-01-30T00:00:00Z',
    modified: '2025-01-30T00:00:00Z',
    has_alert: false,
    shadow_service_enabled: false,
    ecosystem_connected: true,
  },
  {
    id: '3',
    type: 'physical',
    name: 'farm-container-04',
    tenant: 'tenant-222',
    purpose: 'research',
    location: { city: 'Techville', country: 'Canada' },
    status: 'created',
    created: '2025-01-25T00:00:00Z',
    modified: '2025-01-26T00:00:00Z',
    has_alert: false,
    shadow_service_enabled: true,
    ecosystem_connected: false,
  },
  {
    id: '4',
    type: 'physical',
    name: 'farm-container-07',
    tenant: 'tenant-123',
    purpose: 'development',
    location: { city: 'Agriville', country: 'USA' },
    status: 'connected',
    created: '2025-01-25T00:00:00Z',
    modified: '2025-01-26T00:00:00Z',
    has_alert: false,
    shadow_service_enabled: true,
    ecosystem_connected: true,
  },
  {
    id: '5',
    type: 'virtual',
    name: 'virtual-farm-02',
    tenant: 'tenant-123',
    purpose: 'development',
    location: { city: 'Croptown', country: 'USA' },
    status: 'inactive',
    created: '2025-01-13T00:00:00Z',
    modified: '2025-01-15T00:00:00Z',
    has_alert: true,
    shadow_service_enabled: false,
    ecosystem_connected: false,
  },
  {
    id: '6',
    type: 'physical',
    name: 'farm-container-06',
    tenant: 'tenant-5',
    purpose: 'research',
    location: { city: 'Scienceville', country: 'Germany' },
    status: 'connected',
    created: '2025-01-12T00:00:00Z',
    modified: '2025-01-18T00:00:00Z',
    has_alert: false,
    shadow_service_enabled: true,
    ecosystem_connected: true,
  },
];

const meta: Meta<typeof ContainerTable> = {
  title: 'UI/ContainerTable',
  component: ContainerTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    containers: {
      description: 'Array of container objects to display',
    },
    onRowAction: {
      action: 'rowAction',
      description: 'Callback when action button is clicked',
    },
    onContainerUpdated: {
      action: 'containerUpdated',
      description: 'Callback when container is updated via edit panel',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    containers: mockContainers,
  },
};

export const Empty: Story = {
  args: {
    containers: [],
  },
};

export const SingleRow: Story = {
  args: {
    containers: [mockContainers[0]],
  },
};

export const WithAlerts: Story = {
  args: {
    containers: mockContainers.filter(container => container.has_alert),
  },
};

export const VirtualOnly: Story = {
  args: {
    containers: mockContainers.filter(container => container.type === 'virtual'),
  },
};

export const PhysicalOnly: Story = {
  args: {
    containers: mockContainers.filter(container => container.type === 'physical'),
  },
};

export const WithEditIntegration: Story = {
  args: {
    containers: mockContainers.slice(0, 3),
    onRowAction: (container: Container, action: string) => {
      console.log(`Action "${action}" for container: ${container.name}`);
    },
    onContainerUpdated: (container: Container) => {
      console.log('Container updated:', container);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the EditContainerPanel integration. Click the three-dot menu and select "Edit & Settings" to open the edit panel.',
      },
    },
  },
};