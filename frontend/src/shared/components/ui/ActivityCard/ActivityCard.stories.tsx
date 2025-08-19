import type { Meta, StoryObj } from '@storybook/react';
import { ActivityCard } from './ActivityCard';
import { ActivityCardProps } from './types';

// Custom icons for demonstration
const SecurityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L21 5V11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 1Z" fill="currentColor"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8C13.1 8 14 8.9 14 10S13.1 12 12 12 10 11.1 10 10 10.9 8 12 8ZM21.14 12.14C21.73 11.6 21.73 10.4 21.14 9.86L19.86 8.93C19.56 8.71 19.4 8.32 19.5 7.94L19.86 6.5C20.05 5.88 19.6 5.26 18.95 5.07L17.5 4.71C17.12 4.61 16.83 4.27 16.82 3.86L16.71 2.4C16.66 1.74 16.05 1.25 15.39 1.3L13.94 1.41C13.53 1.43 13.16 1.18 12.93 0.82L12 -0.5C11.6 -1.1 10.4 -1.1 10 -0.5L9.07 0.82C8.84 1.18 8.47 1.43 8.06 1.41L6.61 1.3C5.95 1.25 5.34 1.74 5.29 2.4L5.18 3.86C5.17 4.27 4.88 4.61 4.5 4.71L3.05 5.07C2.4 5.26 1.95 5.88 2.14 6.5L2.5 7.94C2.6 8.32 2.44 8.71 2.14 8.93L0.86 9.86C0.27 10.4 0.27 11.6 0.86 12.14L2.14 13.07C2.44 13.29 2.6 13.68 2.5 14.06L2.14 15.5C1.95 16.12 2.4 16.74 3.05 16.93L4.5 17.29C4.88 17.39 5.17 17.73 5.18 18.14L5.29 19.6C5.34 20.26 5.95 20.75 6.61 20.7L8.06 20.59C8.47 20.57 8.84 20.82 9.07 21.18L10 22.5C10.4 23.1 11.6 23.1 12 22.5L12.93 21.18C13.16 20.82 13.53 20.57 13.94 20.59L15.39 20.7C16.05 20.75 16.66 20.26 16.71 19.6L16.82 18.14C16.83 17.73 17.12 17.39 17.5 17.29L18.95 16.93C19.6 16.74 20.05 16.12 19.86 15.5L19.5 14.06C19.4 13.68 19.56 13.29 19.86 13.07L21.14 12.14Z" fill="currentColor"/>
  </svg>
);

const meta: Meta<typeof ActivityCard> = {
  title: 'UI Components/ActivityCard',
  component: ActivityCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
ActivityCard is a reusable component for displaying activity notifications and system events.

**Use Cases:**
- Activity feeds and notification lists
- System event logs and audit trails  
- User action tracking
- Dashboard activity displays
- Real-time event monitoring

**Key Features:**
- Domain-agnostic design for maximum reusability
- Responsive layout that adapts to screen sizes
- Multiple size and visual variants
- Loading and error states
- Customizable avatar icons and colors
- Accessibility support with proper ARIA labels
- Theme integration for consistent styling
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main activity or event message',
    },
    timestamp: {
      control: 'text',
      description: 'When the activity occurred',
    },
    author: {
      control: 'text',
      description: 'Person or system that performed the activity',
    },
    avatarColor: {
      control: 'color',
      description: 'Background color for the avatar',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'outlined', 'elevated'],
      description: 'Visual variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size scale',
    },
    showTimestampIcon: {
      control: 'boolean',
      description: 'Show timestamp icon',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ActivityCardProps>;

// Default story - based on the original Figma design
export const Default: Story = {
  args: {
    title: 'Environment mode switched to Auto',
    timestamp: 'April 10, 2025 - 10:00PM',
    author: 'Markus Johnson',
    avatarColor: '#489F68',
    variant: 'default',
    size: 'md',
    showTimestampIcon: true,
  },
};

// Different activity types with various icons and colors
export const SystemAlert: Story = {
  args: {
    title: 'Security protocol activated',
    timestamp: '2 hours ago',
    author: 'System Administrator',
    avatarIcon: <SecurityIcon />,
    avatarColor: '#EF4444',
    variant: 'default',
    size: 'md',
  },
};

export const UserAction: Story = {
  args: {
    title: 'Temperature settings updated',
    timestamp: 'Today at 2:30 PM',
    author: 'Jane Smith',
    avatarColor: '#3B82F6',
    variant: 'default',
    size: 'md',
  },
};

export const ConfigurationChange: Story = {
  args: {
    title: 'Irrigation schedule modified',
    timestamp: 'Yesterday',
    author: 'Maintenance Team',
    avatarIcon: <SettingsIcon />,
    avatarColor: '#8B5CF6',
    variant: 'default',
    size: 'md',
  },
};

// Size variants
export const SmallSize: Story = {
  args: {
    title: 'Light cycle optimized',
    timestamp: '30 min ago',
    author: 'AI System',
    avatarColor: '#F59E0B',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    title: 'Harvest completed successfully',
    timestamp: 'March 15, 2025',
    author: 'Farm Manager',
    subtitle: 'Total yield: 150kg',
    avatarColor: '#10B981',
    size: 'lg',
  },
};

// Visual variants
export const CompactVariant: Story = {
  args: {
    title: 'Nutrient levels adjusted',
    timestamp: '1 hour ago',
    author: 'Automated System',
    variant: 'compact',
    avatarColor: '#6366F1',
  },
};

export const OutlinedVariant: Story = {
  args: {
    title: 'Backup system activated',
    timestamp: 'Today at 9:15 AM',
    author: 'Emergency Protocol',
    variant: 'outlined',
    avatarColor: '#DC2626',
  },
};

export const ElevatedVariant: Story = {
  args: {
    title: 'New growth phase initiated',
    timestamp: 'March 20, 2025',
    author: 'Growth Specialist',
    variant: 'elevated',
    avatarColor: '#059669',
  },
};

// Interactive states
export const Clickable: Story = {
  args: {
    title: 'Click to view details',
    timestamp: 'Just now',
    author: 'Interactive Demo',
    avatarColor: '#7C3AED',
    onClick: () => alert('Activity card clicked!'),
  },
};

export const Disabled: Story = {
  args: {
    title: 'This activity is disabled',
    timestamp: 'Disabled state',
    author: 'Demo User',
    avatarColor: '#6B7280',
    disabled: true,
    onClick: () => alert('This should not fire'),
  },
};

// Loading and error states
export const Loading: Story = {
  args: {
    title: 'Loading...',
    loading: true,
  },
};

export const ErrorState: Story = {
  args: {
    title: 'This will not be shown',
    error: 'Failed to load activity data',
  },
};

// Minimal content
export const MinimalContent: Story = {
  args: {
    title: 'Simple activity message',
    avatarColor: '#6B7280',
    showTimestampIcon: false,
  },
};

// With footer content
export const WithFooter: Story = {
  args: {
    title: 'Data sync completed',
    timestamp: 'Today at 11:30 AM',
    author: 'Sync Service',
    avatarColor: '#0EA5E9',
    footerSlot: (
      <div style={{ fontSize: '12px', color: '#6B7280' }}>
        📊 1,250 records synchronized
      </div>
    ),
  },
};

// Long content to test wrapping
export const LongContent: Story = {
  args: {
    title: 'This is a very long activity message that should wrap properly and maintain good readability across different screen sizes and container widths',
    timestamp: 'March 18, 2025 at 3:45:22 PM EST',
    author: 'Very Long Username That Also Tests Wrapping',
    avatarColor: '#EC4899',
    size: 'md',
  },
};
