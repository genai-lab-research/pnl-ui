import type { Meta, StoryObj } from '@storybook/react';
import { NavigationBreadcrumb } from './NavigationBreadcrumb';

const meta = {
  title: 'Shared/NavigationBreadcrumb',
  component: NavigationBreadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['default', 'compact', 'minimal'],
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    arrowDirection: {
      control: { type: 'radio' },
      options: ['left', 'right', 'up', 'down'],
    },
    backgroundVariant: {
      control: { type: 'radio' },
      options: ['dark', 'light', 'transparent'],
    },
    onClick: { action: 'navigated' },
  },
} satisfies Meta<typeof NavigationBreadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Back to Dashboard',
    arrowDirection: 'left',
  },
};

export const WithSubtitle: Story = {
  args: {
    label: 'Previous Page',
    subtitle: 'Return to overview',
    arrowDirection: 'left',
  },
};

export const RightArrow: Story = {
  args: {
    label: 'Next Step',
    subtitle: 'Continue to next page',
    arrowDirection: 'right',
  },
};

export const UpArrow: Story = {
  args: {
    label: 'Go Up',
    subtitle: 'Navigate to parent',
    arrowDirection: 'up',
  },
};

export const DownArrow: Story = {
  args: {
    label: 'Go Down',
    subtitle: 'Navigate to child',
    arrowDirection: 'down',
  },
};

export const Compact: Story = {
  args: {
    label: 'Back',
    variant: 'compact',
    arrowDirection: 'left',
  },
};

export const Minimal: Story = {
  args: {
    label: 'Home',
    variant: 'minimal',
    arrowDirection: 'left',
  },
};

export const Small: Story = {
  args: {
    label: 'Back to list',
    size: 'sm',
    arrowDirection: 'left',
  },
};

export const Large: Story = {
  args: {
    label: 'Back to Dashboard',
    subtitle: 'Return to main view',
    size: 'lg',
    arrowDirection: 'left',
  },
};

export const LightBackground: Story = {
  args: {
    label: 'Back to Settings',
    backgroundVariant: 'light',
    arrowDirection: 'left',
  },
};

export const TransparentBackground: Story = {
  args: {
    label: 'Back to Home',
    backgroundVariant: 'transparent',
    arrowDirection: 'left',
  },
};

export const Interactive: Story = {
  args: {
    label: 'Click to Navigate',
    subtitle: 'This breadcrumb is clickable',
    onClick: () => alert('Navigation triggered!'),
    arrowDirection: 'left',
  },
};

export const Loading: Story = {
  args: {
    label: 'Loading...',
    loading: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Navigation Error',
    error: 'Failed to load navigation',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <NavigationBreadcrumb
        label="Default Variant"
        subtitle="Standard navigation"
        variant="default"
        arrowDirection="left"
      />
      <NavigationBreadcrumb
        label="Compact Variant"
        subtitle="Space-efficient"
        variant="compact"
        arrowDirection="left"
      />
      <NavigationBreadcrumb
        label="Minimal Variant"
        subtitle="Clean and simple"
        variant="minimal"
        arrowDirection="left"
      />
    </div>
  ),
};

export const AllDirections: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '400px' }}>
      <NavigationBreadcrumb
        label="Left Arrow"
        subtitle="Go back"
        arrowDirection="left"
      />
      <NavigationBreadcrumb
        label="Right Arrow"
        subtitle="Go forward"
        arrowDirection="right"
      />
      <NavigationBreadcrumb
        label="Up Arrow"
        subtitle="Go up"
        arrowDirection="up"
      />
      <NavigationBreadcrumb
        label="Down Arrow"
        subtitle="Go down"
        arrowDirection="down"
      />
    </div>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <NavigationBreadcrumb
          label="Dark Background"
          subtitle="Default theme"
          backgroundVariant="dark"
          arrowDirection="left"
        />
      </div>
      <div style={{ padding: '1rem', backgroundColor: '#333' }}>
        <NavigationBreadcrumb
          label="Light Background"
          subtitle="Light theme"
          backgroundVariant="light"
          arrowDirection="left"
        />
      </div>
      <div style={{ padding: '1rem', backgroundColor: '#e0e0e0' }}>
        <NavigationBreadcrumb
          label="Transparent"
          subtitle="No background"
          backgroundVariant="transparent"
          arrowDirection="left"
        />
      </div>
    </div>
  ),
};