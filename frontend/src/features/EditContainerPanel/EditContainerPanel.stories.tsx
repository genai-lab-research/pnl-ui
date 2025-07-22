import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EditContainerPanel } from './EditContainerPanel';
import { Container } from '../../shared/types/containers';

const mockContainer: Container = {
  id: 'container-123',
  name: 'farm-container-04',
  tenant: 'tenant-23',
  type: 'virtual',
  purpose: 'development',
  location: {
    city: 'San Francisco',
    country: 'USA',
    address: 'Farm Facility A'
  },
  status: 'active',
  seed_types: [
    { id: 1, name: 'Someroots', variety: 'V1', supplier: 'Supplier A', batch_id: 'B001' },
    { id: 2, name: 'sunflower', variety: 'Standard', supplier: 'Supplier B', batch_id: 'B002' }
  ],
  created: '2024-01-15T10:30:00Z',
  modified: '2024-01-20T14:45:00Z',
  has_alert: false,
  notes: 'Primary production container for Farm A.',
  shadow_service_enabled: true,
  ecosystem_connected: false
};

// Create a wrapper component that provides mock context
const EditContainerPanelWrapper = (args: any) => {
  return (
    <div>
      <EditContainerPanel {...args} />
    </div>
  );
};

const meta: Meta<typeof EditContainerPanelWrapper> = {
  title: 'Features/EditContainerPanel',
  component: EditContainerPanelWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'EditContainerPanel for modifying existing container configurations'
      }
    }
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
    },
    container: {
      control: { type: 'object' },
    },
    onClose: { action: 'onClose' },
    onSuccess: { action: 'onSuccess' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    container: mockContainer,
    onClose: () => console.log('Panel closed'),
    onSuccess: (container: Container) => console.log('Container updated:', container),
  },
};

export const PhysicalContainer: Story = {
  args: {
    open: true,
    container: {
      ...mockContainer,
      type: 'physical',
      location: {
        city: 'San Francisco',
        country: 'USA',
        address: 'Farm Facility A'
      }
    },
    onClose: () => console.log('Panel closed'),
    onSuccess: (container: Container) => console.log('Container updated:', container),
  },
};

export const ConnectedContainer: Story = {
  args: {
    open: true,
    container: {
      ...mockContainer,
      ecosystem_connected: true,
    },
    onClose: () => console.log('Panel closed'),
    onSuccess: (container: Container) => console.log('Container updated:', container),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    container: mockContainer,
    onClose: () => console.log('Panel closed'),
    onSuccess: (container: Container) => console.log('Container updated:', container),
  },
};