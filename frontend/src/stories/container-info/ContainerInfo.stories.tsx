import type { Meta, StoryObj } from '@storybook/react';
import ContainerInfo from '../../shared/components/ui/ContainerInfo';

const meta: Meta<typeof ContainerInfo> = {
  title: 'Components/ContainerInfo',
  component: ContainerInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContainerInfo>;

export const Default: Story = {
  args: {
    name: 'farm-container-04',
    type: 'Physical',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Lviv',
    status: 'Active',
    created: '30/01/2025, 09:30',
    lastModified: '30/01/2025, 11:14',
    creator: 'Mia Adams',
    seedTypes: 'Someroots, sunflower, Someroots, Someroots',
    notes: 'Primary production container for Farm A.',
  },
};

export const WithLongNotes: Story = {
  args: {
    ...Default.args,
    notes: 'Primary production container for Farm A. This container is used for vertical farming experiments. It has multiple sensors installed to monitor temperature, humidity, and light levels. The container is regularly maintained and serviced by the farm operations team.',
  },
};