import type { Meta, StoryObj } from '@storybook/react';
import { ActionButton } from './ActionButton';
import React from 'react';

// Plus Icon for demonstration
const PlusIcon: React.FC = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M8 3.33v9.34M3.33 8h9.34"
      stroke="currentColor"
      strokeWidth="1.33"
      strokeLinecap="round"
    />
  </svg>
);

// Save Icon for demonstration
const SaveIcon: React.FC = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M13.33 14V6L10 2.67H2.67v11.33h10.66z"
      stroke="currentColor"
      strokeWidth="1.33"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 8h8M6 11.33h4"
      stroke="currentColor"
      strokeWidth="1.33"
      strokeLinecap="round"
    />
  </svg>
);

// Download Icon for demonstration
const DownloadIcon: React.FC = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M8 10.67V2.67M5.33 8L8 10.67 10.67 8M2.67 13.33h10.66"
      stroke="currentColor"
      strokeWidth="1.33"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const meta = {
  title: 'UI/ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A generic, reusable action button component that can be used across different contexts. Based on the Figma design specification with 0.5 opacity, blue background (#3545EE), and white text. Supports multiple variants, sizes, and states for maximum reusability.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Button text content',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when button is clicked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state to show spinner',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'ghost', 'elevated'],
      description: 'Button visual variant',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Button type attribute',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Icon position relative to text',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility',
    },
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story - matches original design
export const Default: Story = {
  args: {
    text: 'Create Container',
    size: 'md',
    variant: 'default',
  },
};

// Different contexts to demonstrate reusability
export const CreateResource: Story = {
  args: {
    text: 'Create Resource',
    iconSlot: <PlusIcon />,
    size: 'md',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Generic resource creation button with plus icon.',
      },
    },
  },
};

export const SaveChanges: Story = {
  args: {
    text: 'Save Changes',
    iconSlot: <SaveIcon />,
    size: 'md',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Save action button with save icon.',
      },
    },
  },
};

export const ExportData: Story = {
  args: {
    text: 'Export Data',
    iconSlot: <DownloadIcon />,
    iconPosition: 'right',
    size: 'md',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Export action button with download icon on the right.',
      },
    },
  },
};

// Size variants
export const SizeSmall: Story = {
  args: {
    text: 'Small Action',
    size: 'sm',
    variant: 'default',
  },
};

export const SizeLarge: Story = {
  args: {
    text: 'Large Action',
    size: 'lg',
    variant: 'default',
  },
};

// Visual variants
export const Outlined: Story = {
  args: {
    text: 'Outlined Button',
    variant: 'outlined',
    iconSlot: <PlusIcon />,
  },
};

export const Ghost: Story = {
  args: {
    text: 'Ghost Button',
    variant: 'ghost',
    iconSlot: <PlusIcon />,
  },
};

export const Elevated: Story = {
  args: {
    text: 'Elevated Button',
    variant: 'elevated',
    iconSlot: <PlusIcon />,
  },
};

// State variants
export const Loading: Story = {
  args: {
    text: 'Processing...',
    loading: true,
    size: 'md',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with spinner animation.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    text: 'Disabled Action',
    disabled: true,
    iconSlot: <PlusIcon />,
    size: 'md',
    variant: 'default',
  },
};

export const WithError: Story = {
  args: {
    text: 'Submit Form',
    error: 'Please fix validation errors before submitting',
    size: 'md',
    variant: 'default',
  },
};

export const FullWidth: Story = {
  args: {
    text: 'Full Width Action',
    fullWidth: true,
    iconSlot: <PlusIcon />,
    size: 'md',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Full width button that stretches to container width.',
      },
    },
  },
};

// Responsive demonstration
export const ResponsiveDemo: Story = {
  args: {
    text: 'Responsive Button',
    iconSlot: <PlusIcon />,
    size: 'md',
    variant: 'default',
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
        story: 'This story demonstrates the responsive behavior across different screen sizes.',
      },
    },
  },
};

// All variants showcase
export const AllVariants: Story = {
  args: {
    text: 'Example',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <ActionButton text="Default" variant="default" />
        <ActionButton text="Outlined" variant="outlined" />
        <ActionButton text="Ghost" variant="ghost" />
        <ActionButton text="Elevated" variant="elevated" />
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <ActionButton text="Small" size="sm" iconSlot={<PlusIcon />} />
        <ActionButton text="Medium" size="md" iconSlot={<PlusIcon />} />
        <ActionButton text="Large" size="lg" iconSlot={<PlusIcon />} />
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <ActionButton text="Loading" loading />
        <ActionButton text="Disabled" disabled iconSlot={<PlusIcon />} />
        <ActionButton text="With Error" error="Error message" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive showcase of all button variants, sizes, and states.',
      },
    },
  },
};
