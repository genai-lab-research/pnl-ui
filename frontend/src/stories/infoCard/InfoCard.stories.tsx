import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { InfoCard, ContainerInfoData } from '../../shared/components/ui/InfoCard';
import Box from '@mui/material/Box';
import StorageIcon from '@mui/icons-material/Storage';

const meta = {
  title: 'UI/InfoCard',
  component: InfoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ width: '100%', maxWidth: '800px', p: 2 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data matching the reference image
const defaultContainerData: ContainerInfoData = {
  name: 'farm-container-04',
  id: '51',
  type: 'Physical',
  tenant: 'tenant-123',
  purpose: 'Development',
  location: 'Lviv',
  status: 'active',
  created: '30/01/2025, 09:30',
  lastModified: '30/01/2025, 11:14',
  creator: 'Mia Adams',
  seedTypes: 'Someroots, sunflower, Someroots, Someroots',
  notes: 'Primary production container for Farm A.',
  typeIcon: <StorageIcon fontSize="small" sx={{ color: '#000000' }} />,
};

// Basic story with default data
export const Default: Story = {
  args: {
    containerData: defaultContainerData,
  },
};

// Active status example
export const ActiveContainer: Story = {
  args: {
    containerData: {
      ...defaultContainerData,
      status: 'active',
    },
  },
};

// Inactive status example
export const InactiveContainer: Story = {
  args: {
    containerData: {
      ...defaultContainerData,
      status: 'inactive',
      name: 'farm-container-05',
      id: '52',
    },
  },
};

// In progress status example
export const InProgressContainer: Story = {
  args: {
    containerData: {
      ...defaultContainerData,
      status: 'in-progress',
      name: 'farm-container-06',
      id: '53',
    },
  },
};

// Example without notes
export const WithoutNotes: Story = {
  args: {
    containerData: {
      ...defaultContainerData,
      notes: undefined,
    },
  },
};

// Example with long content
export const LongContent: Story = {
  args: {
    containerData: {
      ...defaultContainerData,
      name: 'farm-container-with-very-long-name-that-might-overflow-on-small-screens-04',
      seedTypes: 'Someroots, sunflower, tomatoes, potatoes, carrots, lettuce, spinach, kale, broccoli, cabbage, cucumber, zucchini, onions, garlic, basil, thyme, rosemary, mint, parsley, cilantro',
      notes: 'This is a very detailed note about this container. It contains information about the container\'s purpose, content, maintenance schedule, and other important details that operators need to know. The container is primarily used for experimental farming techniques and houses a variety of seedlings at different growth stages. Regular inspection and watering schedules must be maintained to ensure optimal growth conditions.',
    },
  },
};

// Mobile viewport example
export const MobileView: Story = {
  args: {
    containerData: defaultContainerData,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Tablet viewport example
export const TabletView: Story = {
  args: {
    containerData: defaultContainerData,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};