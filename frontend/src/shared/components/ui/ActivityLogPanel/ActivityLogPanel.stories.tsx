import type { Meta, StoryObj } from '@storybook/react';
import { ActivityLogPanel } from './ActivityLogPanel';
import { ActivityLogEntry } from './types';

const meta: Meta<typeof ActivityLogPanel> = {
  title: 'UI/ActivityLogPanel',
  component: ActivityLogPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockActivities: ActivityLogEntry[] = [
  {
    id: '1',
    description: 'Seeded Salanova Countkevi in Nursery',
    timestamp: '2025-04-15T22:35:00Z',
    user: 'Emily Chen',
    type: 'seeding',
  },
  {
    id: '2',
    description: 'Data synced',
    timestamp: '2025-04-15T22:34:00Z',
    type: 'system',
  },
  {
    id: '3',
    description: 'Environment mode switched to Auto',
    timestamp: '2025-04-15T22:34:00Z',
    type: 'system',
  },
  {
    id: '4',
    description: 'Container created',
    timestamp: '2025-04-15T21:36:00Z',
    type: 'system',
  },
  {
    id: '5',
    description: 'Container maintenance performed',
    timestamp: '2025-04-10T22:30:00Z',
    user: 'Maintenance Team',
    type: 'maintenance',
  },
];

export const Default: Story = {
  args: {
    activities: mockActivities,
  },
};

export const Loading: Story = {
  args: {
    activities: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    activities: [],
  },
};

export const CustomTitle: Story = {
  args: {
    activities: mockActivities,
    title: 'Recent Activity',
  },
};

export const WithMaxHeight: Story = {
  args: {
    activities: mockActivities,
    maxHeight: 200,
  },
};