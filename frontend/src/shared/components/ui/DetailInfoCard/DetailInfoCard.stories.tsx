import type { Meta, StoryObj } from '@storybook/react';
import { DetailInfoCard } from './DetailInfoCard';
import { DataRow, InfoSection, StatusBadge } from './types';
import React from 'react';

// Mock icon component for stories
const MockIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 2L2 7V17L12 22L22 17V7L12 2Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const meta: Meta<typeof DetailInfoCard> = {
  title: 'UI/DetailInfoCard',
  component: DetailInfoCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A reusable component for displaying detailed information in a structured card format.
Perfect for showing entity details, configuration panels, or information summaries.

**Key Features:**
- Responsive design with multiple size variants
- Status badges with different states
- Flexible data rows with optional icons
- Additional sections for extended content
- Loading and error states
- Accessibility support
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main card title',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'outlined', 'elevated'],
      description: 'Visual variant of the card',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size scale of the card',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with skeleton placeholders',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the card is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DetailInfoCard>;

// Sample data for stories
const containerDataRows: DataRow[] = [
  { label: 'Name', value: 'farm-container-04' },
  { label: 'Type', value: 'Physical', icon: <MockIcon /> },
  { label: 'Tenant', value: 'tenant-123' },
  { label: 'Purpose', value: 'Development' },
  { label: 'Location', value: 'Lviv' },
  { label: 'Status', value: 'Active' },
  { label: 'Created', value: '30/01/2025, 09:30' },
  { label: 'Last Modified', value: '30/01/2025, 11:14' },
  { label: 'Creator', value: 'Mia Adams' },
];

const statusBadge: StatusBadge = {
  text: 'Active',
  variant: 'active',
};

const sections: InfoSection[] = [
  {
    title: 'Seed Type',
    content: 'Someroots, sunflower, Someroots, Someroots',
  },
  {
    title: 'Notes',
    content: 'This container is currently being used for development testing of new growing techniques. Monitor daily for optimal results.',
  },
];

// Stories
export const Default: Story = {
  args: {
    title: 'Container Information',
    dataRows: containerDataRows,
    statusBadge,
    sections,
  },
};

export const ProductOverview: Story = {
  args: {
    title: 'Product Overview',
    dataRows: [
      { label: 'Product Name', value: 'Hydroponic Lettuce' },
      { label: 'SKU', value: 'HYD-LET-001' },
      { label: 'Category', value: 'Leafy Greens' },
      { label: 'Stock Level', value: '2,450 units' },
      { label: 'Status', value: 'In Stock' },
      { label: 'Last Updated', value: '15/01/2025, 14:30' },
    ],
    statusBadge: { text: 'In Stock', variant: 'success' },
    sections: [
      {
        title: 'Description',
        content: 'Fresh hydroponic lettuce grown in controlled environment with optimal nutrient delivery.',
      },
    ],
  },
};

export const UserProfile: Story = {
  args: {
    title: 'User Profile',
    dataRows: [
      { label: 'Name', value: 'Sarah Wilson' },
      { label: 'Email', value: 'sarah.wilson@example.com' },
      { label: 'Role', value: 'Farm Manager' },
      { label: 'Department', value: 'Operations' },
      { label: 'Status', value: 'Active' },
      { label: 'Last Login', value: '29/01/2025, 16:45' },
    ],
    statusBadge: { text: 'Active', variant: 'active' },
    sections: [
      {
        title: 'Permissions',
        content: 'Full access to container management, read-only access to financial reports.',
      },
    ],
  },
};

export const Compact: Story = {
  args: {
    title: 'Quick Info',
    dataRows: containerDataRows.slice(0, 4),
    statusBadge,
    variant: 'compact',
  },
};

export const Outlined: Story = {
  args: {
    title: 'Container Information',
    dataRows: containerDataRows,
    statusBadge,
    sections,
    variant: 'outlined',
  },
};

export const Elevated: Story = {
  args: {
    title: 'Container Information',
    dataRows: containerDataRows,
    statusBadge,
    sections,
    variant: 'elevated',
  },
};

export const SmallSize: Story = {
  args: {
    title: 'Container Info',
    dataRows: containerDataRows.slice(0, 5),
    statusBadge,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    title: 'Container Information',
    dataRows: containerDataRows,
    statusBadge,
    sections,
    size: 'lg',
  },
};

export const WithWarningStatus: Story = {
  args: {
    title: 'System Alert',
    dataRows: [
      { label: 'Alert Type', value: 'Temperature Warning' },
      { label: 'Severity', value: 'Medium' },
      { label: 'Location', value: 'Greenhouse A' },
      { label: 'Status', value: 'Active' },
      { label: 'Detected', value: '30/01/2025, 12:00' },
    ],
    statusBadge: { text: 'Warning', variant: 'warning' },
    sections: [
      {
        title: 'Description',
        content: 'Temperature has exceeded optimal range. Immediate attention required.',
      },
    ],
  },
};

export const WithErrorStatus: Story = {
  args: {
    title: 'System Error',
    dataRows: [
      { label: 'Error Code', value: 'ERR_001' },
      { label: 'Component', value: 'Water Pump #3' },
      { label: 'Severity', value: 'Critical' },
      { label: 'Status', value: 'Failed' },
      { label: 'Occurred', value: '30/01/2025, 08:15' },
    ],
    statusBadge: { text: 'Failed', variant: 'error' },
    sections: [
      {
        title: 'Details',
        content: 'Water pump has stopped functioning. Replace immediately to prevent crop damage.',
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    title: 'Container Information',
    dataRows: containerDataRows,
    statusBadge,
    sections,
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    title: 'Container Information',
    dataRows: containerDataRows,
    statusBadge,
    sections,
    error: 'Failed to load container information. Please try again.',
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Container Information',
    dataRows: containerDataRows,
    statusBadge,
    sections,
    footerSlot: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: 'white' }}>
          Edit
        </button>
        <button style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#4CAF50', color: 'white' }}>
          Save
        </button>
      </div>
    ),
  },
};

export const Clickable: Story = {
  args: {
    title: 'Container Information',
    dataRows: containerDataRows.slice(0, 5),
    statusBadge,
    onClick: () => alert('Card clicked!'),
  },
};
