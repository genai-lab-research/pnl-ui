import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ControlBlock } from './ControlBlock';

const meta = {
  title: 'UI/ControlBlock',
  component: ControlBlock,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A compact control component for dashboard navigation. Displays an icon and label in a horizontal layout, typically used for navigation or action triggers in control panels.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text to display next to the icon',
    },
    iconSlot: {
      control: false,
      description: 'Optional icon slot for custom icons',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the control block is clicked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the control block is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state to show spinner instead of icon',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'outlined', 'elevated'],
      description: 'Visual variant of the control block',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size scale of the control block',
    },
    error: {
      control: 'text',
      description: 'Error state message',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility',
    },
  },
} satisfies Meta<typeof ControlBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// Custom icon component for examples
const CustomIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 12l-4-4h8l-4 4z" fill="#FFFFFF" />
  </svg>
);

const DatabaseIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" fill="#FFFFFF" />
  </svg>
);

export const Default: Story = {
  args: {
    label: 'Container Dashboard / farm-container-04',
    variant: 'default',
    size: 'md',
  },
};

export const WithCustomIcon: Story = {
  args: {
    label: 'Production Overview',
    iconSlot: <CustomIcon />,
    variant: 'default',
    size: 'md',
  },
};

export const DatabaseControl: Story = {
  args: {
    label: 'Database Management / prod-db-01',
    iconSlot: <DatabaseIcon />,
    variant: 'default',
    size: 'md',
  },
};

export const AllSizes: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ControlBlock
        label="Small Control Block"
        size="sm"
        variant="default"
      />
      <ControlBlock
        label="Medium Control Block"
        size="md"
        variant="default"
      />
      <ControlBlock
        label="Large Control Block"
        size="lg"
        variant="default"
      />
    </div>
  ),
};

export const AllVariants: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ControlBlock
        label="Default Variant"
        variant="default"
        size="md"
      />
      <ControlBlock
        label="Compact Variant"
        variant="compact"
        size="md"
      />
      <ControlBlock
        label="Outlined Variant"
        variant="outlined"
        size="md"
      />
      <ControlBlock
        label="Elevated Variant"
        variant="elevated"
        size="md"
      />
    </div>
  ),
};

export const LoadingState: Story = {
  args: {
    label: 'Processing Data...',
    loading: true,
    variant: 'default',
    size: 'md',
  },
};

export const DisabledState: Story = {
  args: {
    label: 'Disabled Control Block',
    disabled: true,
    variant: 'default',
    size: 'md',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Failed Connection',
    error: 'Unable to connect to the database',
    variant: 'default',
    size: 'md',
  },
};

export const DifferentMetrics: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <ControlBlock
        label="Crop Yield Monitoring / sensor-01"
        variant="default"
        size="md"
      />
      <ControlBlock
        label="Temperature Control / hvac-02"
        variant="default"
        size="md"
      />
      <ControlBlock
        label="Nutrient Management / pump-03"
        variant="default"
        size="md"
      />
      <ControlBlock
        label="Lighting System / led-array-04"
        variant="default"
        size="md"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the reusability of the ControlBlock component with different content types while maintaining consistent visual styling.',
      },
    },
  },
};

export const ResponsiveDemo: Story = {
  args: {
    label: 'Responsive Control Block',
    variant: 'default',
    size: 'md',
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
      },
    },
    docs: {
      description: {
        story: 'This story demonstrates the responsive behavior of the ControlBlock component across different screen sizes.',
      },
    },
  },
};

export const WithFooterContent: Story = {
  args: {
    label: 'Advanced Control Block',
    variant: 'elevated',
    size: 'md',
    footerSlot: (
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        Last updated: 2 minutes ago
      </div>
    ),
  },
};
