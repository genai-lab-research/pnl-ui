import type { Meta, StoryObj } from '@storybook/react';
import { MetricStatCard } from './MetricStatCard';
import { theme } from '../../../../styles/theme';

const meta: Meta<typeof MetricStatCard> = {
  title: 'UI/MetricStatCard',
  component: MetricStatCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A reusable component for displaying metric statistics with icons and values.
Perfect for dashboards, control panels, or metric displays.

## Features
- Responsive design that adapts to different screen sizes
- Multiple size variants (sm, md, lg)  
- Visual variants (default, compact, outlined, elevated)
- Loading and error states
- Customizable icons and footer content
- Theme integration with consistent styling
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Metric or section title',
    },
    value: {
      control: 'text',
      description: 'Primary numeric/text value',
    },
    unit: {
      control: 'text',
      description: 'Value unit (e.g., "%", "kg/ha", "°C")',
    },
    delta: {
      control: 'text',
      description: 'Change since previous period',
    },
    deltaDirection: {
      control: 'select',
      options: ['up', 'down', 'flat'],
      description: 'Trend direction for visuals/colors',
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
    loading: {
      control: 'boolean',
      description: 'Loading state with skeletons',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MetricStatCard>;

// Default story matching the original design
export const Default: Story = {
  args: {
    title: 'Yield',
    value: '51',
    unit: 'KG',
    delta: '+1.5Kg',
    iconName: 'garden_cart',
    variant: 'default',
    size: 'md',
  },
};

// Different metric examples to show reusability
export const Temperature: Story = {
  args: {
    title: 'Temperature',
    value: '24.5',
    unit: '°C',
    delta: '+1.2°C',
    variant: 'default',
    size: 'md',
  },
};

export const Humidity: Story = {
  args: {
    title: 'Humidity',
    value: '68',
    unit: '%',
    delta: '-3%',
    deltaDirection: 'down',
    variant: 'default',
    size: 'md',
  },
};

export const Revenue: Story = {
  args: {
    title: 'Revenue',
    value: '$12,450',
    delta: '+8.2%',
    deltaDirection: 'up',
    variant: 'default',
    size: 'md',
  },
};

// Size variants
export const SmallSize: Story = {
  args: {
    title: 'Efficiency',
    value: '94.2',
    unit: '%',
    delta: '+2.1%',
    variant: 'default',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    title: 'Production',
    value: '1,250',
    unit: 'units',
    delta: '+150 units',
    variant: 'default',
    size: 'lg',
  },
};

// Visual variants
export const Compact: Story = {
  args: {
    title: 'Storage',
    value: '85',
    unit: '%',
    delta: '+5%',
    variant: 'compact',
    size: 'md',
  },
};

export const Outlined: Story = {
  args: {
    title: 'Quality',
    value: '98.7',
    unit: '%',
    delta: '+0.3%',
    variant: 'outlined',
    size: 'md',
  },
};

export const Elevated: Story = {
  args: {
    title: 'Performance',
    value: '127',
    unit: 'pts',
    delta: '+12 pts',
    variant: 'elevated',
    size: 'md',
  },
};

// States
export const Loading: Story = {
  args: {
    title: 'Loading Metric',
    loading: true,
    variant: 'default',
    size: 'md',
  },
};

export const WithError: Story = {
  args: {
    title: 'Failed Metric',
    error: 'Failed to load metric data',
    variant: 'default',
    size: 'md',
  },
};

export const Clickable: Story = {
  args: {
    title: 'Interactive',
    value: '42',
    unit: 'items',
    delta: '+7 items',
    variant: 'default',
    size: 'md',
    onClick: () => alert('Card clicked!'),
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled',
    value: '15',
    unit: 'kg',
    delta: '+2kg',
    variant: 'default',
    size: 'md',
    disabled: true,
    onClick: () => alert('This should not fire'),
  },
};

// With footer content
export const WithFooter: Story = {
  args: {
    title: 'Sales',
    value: '$25,680',
    delta: '+12.5%',
    variant: 'default',
    size: 'md',
    footerSlot: (
      <div style={{ 
        fontSize: '12px', 
        color: theme.colors.textMuted, 
        textAlign: 'center' 
      }}>
        Last updated: 2 min ago
      </div>
    ),
  },
};

// Multiple cards showcase
export const Showcase: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '16px',
      padding: '16px',
      maxWidth: '800px',
    }}>
      <MetricStatCard 
        title="Yield" 
        value="51" 
        unit="KG" 
        delta="+1.5Kg" 
        iconName="garden_cart"
        variant="default"
      />
      <MetricStatCard 
        title="Temperature" 
        value="24.5" 
        unit="°C" 
        delta="+1.2°C"
        variant="outlined"
      />
      <MetricStatCard 
        title="Humidity" 
        value="68" 
        unit="%" 
        delta="-3%"
        variant="elevated"
      />
      <MetricStatCard 
        title="Efficiency" 
        value="94.2" 
        unit="%" 
        delta="+2.1%"
        variant="compact"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
