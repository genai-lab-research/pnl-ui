import { Meta, StoryObj } from '@storybook/react';
import Header from '../../shared/components/ui/Header';

const meta: Meta<typeof Header> = {
  title: 'UI/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    breadcrumb: { control: 'text' },
    title: { control: 'text' },
    metadata: { control: 'text' },
    status: {
      control: { type: 'select' },
      options: ['active', 'inactive', 'in-progress'],
    },
    avatarSrc: { control: 'text' },
    tabs: { control: 'object' },
    selectedTab: { control: 'number' },
    onTabChange: { action: 'tab changed' },
    onBackClick: { action: 'back clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

// Default story with all props
export const Default: Story = {
  args: {
    breadcrumb: 'Container Dashboard / farm-container-04',
    title: 'farm-container-04',
    metadata: 'Physical container | Tenant-123 | Development',
    status: 'active',
    avatarSrc: 'https://i.pravatar.cc/300',
    tabs: [
      { label: 'Overview', value: 0 },
      { label: 'Inspection (3D tour)', value: 1 },
      { label: 'Environment & Recipes', value: 2 },
      { label: 'Inventory', value: 3 },
      { label: 'Devices', value: 4 },
    ],
    selectedTab: 0,
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
    docs: {
      description: {
        story: 'Default header with all features enabled.',
      },
    },
  },
};

// Tablet responsive view
export const TabletView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Header rendered at tablet size (768px).',
      },
    },
  },
};

// Mobile responsive view
export const MobileView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Header rendered at mobile size (320px).',
      },
    },
  },
};

// With badge notifications
export const WithBadges: Story = {
  args: {
    ...Default.args,
    tabs: [
      { label: 'Overview', value: 0 },
      { label: 'Inspection (3D tour)', value: 1, badge: 3 },
      { label: 'Environment & Recipes', value: 2, badge: 1 },
      { label: 'Inventory', value: 3 },
      { label: 'Devices', value: 4 },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with notification badges on some tabs.',
      },
    },
  },
};

// With long title and metadata
export const LongContent: Story = {
  args: {
    breadcrumb: 'Container Dashboard / This is a very long farm container name that should be truncated',
    title: 'This is a very long farm container name that should be truncated appropriately',
    metadata: 'Physical container | Tenant ID: ACME-CORP-2023-SPRING | Development Environment | Last Updated: Yesterday',
    status: 'active',
    avatarSrc: 'https://i.pravatar.cc/300',
    tabs: [...(Default.args?.tabs || [])],
    selectedTab: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with very long text to test overflow handling.',
      },
    },
  },
};

// In progress status
export const InProgressStatus: Story = {
  args: {
    ...Default.args,
    status: 'in-progress',
  },
  parameters: {
    docs: {
      description: {
        story: 'Header showing in-progress status.',
      },
    },
  },
};

// Inactive status
export const InactiveStatus: Story = {
  args: {
    ...Default.args,
    status: 'inactive',
  },
  parameters: {
    docs: {
      description: {
        story: 'Header showing inactive status.',
      },
    },
  },
};