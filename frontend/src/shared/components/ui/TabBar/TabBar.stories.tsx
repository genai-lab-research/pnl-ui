import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TabBar } from './TabBar';
import { Tab } from './types';

const meta: Meta<typeof TabBar> = {
  title: 'UI/TabBar',
  component: TabBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A horizontal navigation tab bar component that allows users to switch between different sections or views. Supports multiple variants, sizes, and accessibility features.',
      },
    },
  },
  argTypes: {
    tabs: {
      description: 'Array of tab objects with id, label, value, and optional disabled/badge properties',
    },
    value: {
      description: 'Currently selected tab value',
    },
    onChange: {
      description: 'Callback fired when a tab is selected',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'outlined', 'elevated'],
      description: 'Visual variant of the tab bar',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the tab bar',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire tab bar is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the tab bar is in loading state',
    },
    error: {
      control: 'text',
      description: 'Error message to display below the tab bar',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether tabs should expand to fill the full width',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample tabs for different use cases
const dashboardTabs: Tab[] = [
  { id: 'overview', label: 'Overview', value: 'overview' },
  { id: 'analytics', label: 'Analytics', value: 'analytics' },
  { id: 'reports', label: 'Reports', value: 'reports' },
  { id: 'settings', label: 'Settings', value: 'settings' },
];

const projectTabs: Tab[] = [
  { id: 'tasks', label: 'Tasks', value: 'tasks', badge: 3 },
  { id: 'timeline', label: 'Timeline', value: 'timeline' },
  { id: 'team', label: 'Team', value: 'team', badge: 12 },
  { id: 'files', label: 'Files', value: 'files' },
  { id: 'archived', label: 'Archived', value: 'archived', disabled: true },
];

const ecommerceTabs: Tab[] = [
  { id: 'products', label: 'Products', value: 'products' },
  { id: 'orders', label: 'Orders', value: 'orders', badge: 5 },
  { id: 'customers', label: 'Customers', value: 'customers' },
  { id: 'inventory', label: 'Inventory', value: 'inventory' },
  { id: 'analytics', label: 'Analytics', value: 'analytics' },
];

// Interactive wrapper component for stories
const TabBarWrapper = ({ initialValue, tabs, ...props }: any) => {
  const [selectedTab, setSelectedTab] = useState(initialValue);
  
  return (
    <TabBar
      {...props}
      tabs={tabs}
      value={selectedTab}
      onChange={setSelectedTab}
    />
  );
};

export const Default: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: dashboardTabs,
    initialValue: 'overview',
    variant: 'default',
    size: 'md',
  },
};

export const WithBadges: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: projectTabs,
    initialValue: 'tasks',
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Tabs can display badges to show counts or notifications. Badges appear as small circular indicators next to the tab label.',
      },
    },
  },
};

export const FullWidth: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: ecommerceTabs,
    initialValue: 'products',
    variant: 'default',
    size: 'md',
    fullWidth: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Full width tabs distribute available space evenly across all tabs, making them ideal for consistent layouts.',
      },
    },
  },
};

export const Outlined: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: dashboardTabs,
    initialValue: 'analytics',
    variant: 'outlined',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Outlined variant provides a more defined visual separation between tabs with borders.',
      },
    },
  },
};

export const Elevated: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: dashboardTabs,
    initialValue: 'reports',
    variant: 'elevated',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Elevated variant adds shadow effects for a more prominent appearance.',
      },
    },
  },
};

export const Compact: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: dashboardTabs,
    initialValue: 'settings',
    variant: 'compact',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact variant reduces spacing and padding for more condensed layouts.',
      },
    },
  },
};

export const SmallSize: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: dashboardTabs,
    initialValue: 'overview',
    variant: 'default',
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size is ideal for sidebars or compact interface sections.',
      },
    },
  },
};

export const LargeSize: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: dashboardTabs,
    initialValue: 'overview',
    variant: 'default',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size provides more prominent navigation for main interface sections.',
      },
    },
  },
};

export const WithDisabledTabs: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: projectTabs,
    initialValue: 'tasks',
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Individual tabs can be disabled to prevent interaction while maintaining visual context.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: dashboardTabs,
    initialValue: 'overview',
    variant: 'default',
    size: 'md',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The entire tab bar can be disabled, preventing all interactions.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: dashboardTabs,
    initialValue: 'overview',
    variant: 'default',
    size: 'md',
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state shows a spinner while tab content is being fetched.',
      },
    },
  },
};

export const WithError: Story = {
  render: (args) => <TabBarWrapper {...args} />,
  args: {
    tabs: dashboardTabs,
    initialValue: 'overview',
    variant: 'default',
    size: 'md',
    error: 'Failed to load tab content. Please try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Error messages can be displayed below the tab bar to communicate issues to users.',
      },
    },
  },
};

export const Responsive: Story = {
  render: (args) => (
    <div style={{ maxWidth: '600px' }}>
      <TabBarWrapper {...args} />
    </div>
  ),
  args: {
    tabs: ecommerceTabs,
    initialValue: 'products',
    variant: 'default',
    size: 'md',
    fullWidth: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The tab bar adapts to different container widths, maintaining usability across device sizes.',
      },
    },
  },
};
