import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FiUser, FiPackage, FiAlertCircle, FiCheckCircle, FiClock, FiCalendar } from 'react-icons/fi';
import { ActivityNotificationCard } from './ActivityNotificationCard';

const meta = {
  title: 'UI/ActivityNotificationCard',
  component: ActivityNotificationCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A flexible notification card component for displaying activity updates, system notifications, and user events.

## Features
- Multiple visual variants (default, compact, outlined, elevated)
- Avatar with customizable icon and color variants
- Timestamp display with optional icon
- Footer slot for additional content
- Loading and error states
- Clickable interaction support
- Three size options (sm, md, lg)
- Full accessibility support

## Usage
Ideal for activity feeds, notification lists, event logs, and any scenario requiring timestamped updates with user attribution.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: { type: 'text' },
      description: 'Primary notification message',
    },
    author: {
      control: { type: 'text' },
      description: 'Author or source of the activity',
    },
    timestamp: {
      control: { type: 'text' },
      description: 'Timestamp or date information',
    },
    avatarVariant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: 'Avatar background color variant',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'outlined', 'elevated'],
      description: 'Card visual variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ActivityNotificationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default notification
export const Default: Story = {
  args: {
    message: 'John Doe updated the container temperature settings',
    author: 'John Doe',
    timestamp: '2 hours ago',
  },
};

// Success notification
export const SuccessNotification: Story = {
  args: {
    message: 'Container deployment completed successfully',
    author: 'System',
    timestamp: '5 minutes ago',
    avatarIcon: <FiCheckCircle />,
    avatarVariant: 'success',
  },
};

// Warning notification
export const WarningNotification: Story = {
  args: {
    message: 'Temperature approaching upper threshold in Container A',
    author: 'Monitoring System',
    timestamp: '10 minutes ago',
    avatarIcon: <FiAlertCircle />,
    avatarVariant: 'warning',
  },
};

// Error notification
export const ErrorNotification: Story = {
  args: {
    message: 'Failed to sync data with remote server',
    author: 'Sync Service',
    timestamp: '1 hour ago',
    avatarIcon: <FiAlertCircle />,
    avatarVariant: 'error',
  },
};

// User activity
export const UserActivity: Story = {
  args: {
    message: 'Sarah Johnson created a new vertical farm configuration',
    author: 'Sarah Johnson',
    timestamp: '30 minutes ago',
    avatarIcon: <FiUser />,
    avatarVariant: 'info',
  },
};

// Package update
export const PackageUpdate: Story = {
  args: {
    message: 'New batch of seeds added to inventory',
    author: 'Inventory Manager',
    timestamp: 'Yesterday at 3:45 PM',
    avatarIcon: <FiPackage />,
    avatarVariant: 'default',
    timestampIcon: <FiCalendar />,
  },
};

// Compact variant
export const CompactVariant: Story = {
  args: {
    message: 'Quick status update',
    author: 'Admin',
    timestamp: 'Just now',
    variant: 'compact',
    size: 'sm',
  },
};

// Outlined variant
export const OutlinedVariant: Story = {
  args: {
    message: 'System maintenance scheduled for tonight',
    author: 'DevOps Team',
    timestamp: 'In 4 hours',
    variant: 'outlined',
  },
};

// Elevated variant
export const ElevatedVariant: Story = {
  args: {
    message: 'Important: New security policy in effect',
    author: 'Security Team',
    timestamp: 'Today at 9:00 AM',
    variant: 'elevated',
    avatarVariant: 'warning',
  },
};

// With footer content
export const WithFooter: Story = {
  args: {
    message: 'New comment on your container report',
    author: 'Mike Wilson',
    timestamp: '15 minutes ago',
    footerSlot: (
      <div className="flex gap-2 mt-2">
        <button className="text-sm text-blue-600 hover:text-blue-700">View</button>
        <button className="text-sm text-gray-600 hover:text-gray-700">Dismiss</button>
      </div>
    ),
  },
};

// Small size
export const SmallSize: Story = {
  args: {
    message: 'Temperature updated',
    author: 'Sensor',
    timestamp: '1 min ago',
    size: 'sm',
  },
};

// Large size
export const LargeSize: Story = {
  args: {
    message: 'Comprehensive system health check completed with no issues found',
    author: 'Health Monitor',
    timestamp: '2 hours ago',
    size: 'lg',
  },
};

// Clickable notification
export const ClickableNotification: Story = {
  args: {
    message: 'Click to view detailed report',
    author: 'Report Generator',
    timestamp: '45 minutes ago',
    avatarIcon: <FiPackage />,
    variant: 'outlined',
  },
};

// Loading state
export const Loading: Story = {
  args: {
    message: '',
    author: '',
    timestamp: '',
    loading: true,
  },
};

// Error state
export const Error: Story = {
  args: {
    message: '',
    author: '',
    timestamp: '',
    error: 'Failed to load notification details',
  },
};

// Custom timestamp icon
export const CustomTimestamp: Story = {
  args: {
    message: 'Scheduled maintenance window',
    author: 'Operations',
    timestamp: 'Tomorrow at 2:00 AM',
    timestampIcon: <FiClock />,
  },
};