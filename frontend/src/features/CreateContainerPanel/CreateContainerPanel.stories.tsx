import type { Meta, StoryObj } from '@storybook/react';
import { CreateContainerPanel } from './CreateContainerPanel';

const meta: Meta<typeof CreateContainerPanel> = {
  title: 'Features/CreateContainerPanel',
  component: CreateContainerPanel,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the panel is open or closed',
    },
    onClose: {
      action: 'onClose',
      description: 'Callback fired when the panel should close',
    },
    onSuccess: {
      action: 'onSuccess',
      description: 'Callback fired when container is successfully created',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CreateContainerPanel>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => console.log('Panel closed'),
    onSuccess: (container) => console.log('Container created:', container),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => console.log('Panel closed'),
    onSuccess: (container) => console.log('Container created:', container),
  },
};

export const WithMockData: Story = {
  args: {
    open: true,
    onClose: () => console.log('Panel closed'),
    onSuccess: (container) => console.log('Container created:', container),
  },
  parameters: {
    mockData: [
      {
        url: '/api/v1/tenants/',
        method: 'GET',
        status: 200,
        response: [
          { id: 1, name: 'Acme Corp' },
          { id: 2, name: 'Tech Solutions' },
          { id: 3, name: 'Green Farms' },
        ],
      },
      {
        url: '/api/v1/seed-types/',
        method: 'GET',
        status: 200,
        response: [
          { id: 1, name: 'Lettuce', variety: 'Romaine', supplier: 'Seeds Inc', batch_id: 'LET001' },
          { id: 2, name: 'Tomato', variety: 'Cherry', supplier: 'GrowCorp', batch_id: 'TOM002' },
          { id: 3, name: 'Basil', variety: 'Sweet', supplier: 'Herb Masters', batch_id: 'BAS003' },
          { id: 4, name: 'Spinach', variety: 'Baby', supplier: 'Leafy Greens', batch_id: 'SPI004' },
        ],
      },
      {
        url: '/api/v1/containers/',
        method: 'GET',
        status: 200,
        response: {
          data: [
            { id: 1, name: 'Container Alpha', type: 'Physical', status: 'active' },
            { id: 2, name: 'Container Beta', type: 'Physical', status: 'active' },
            { id: 3, name: 'Container Gamma', type: 'Virtual', status: 'active' },
          ],
        },
      },
    ],
  },
};