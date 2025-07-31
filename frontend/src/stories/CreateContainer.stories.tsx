import type { Meta, StoryObj } from '@storybook/react';
import { CreateContainer } from '../shared/components/ui/CreateContainer';

const meta = {
  title: 'UI/CreateContainer',
  component: CreateContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A primary action button for creating new containers in the Vertical-Farming Control Panel. Features a plus circle icon and customizable text with loading and disabled states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the button is clicked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state to show spinner instead of icon',
    },
    text: {
      control: 'text',
      description: 'Custom text for the button',
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'Button type attribute',
    },
    'aria-label': {
      control: 'text',
      description: 'ARIA label for accessibility',
    },
  },
} satisfies Meta<typeof CreateContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Create Container',
    disabled: false,
    loading: false,
    type: 'button',
  },
};

export const Loading: Story = {
  args: {
    text: 'Create Container',
    loading: true,
    disabled: false,
    type: 'button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state shows a spinner instead of the plus icon.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    text: 'Create Container',
    disabled: true,
    loading: false,
    type: 'button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state with reduced opacity and no hover effects.',
      },
    },
  },
};

export const CustomText: Story = {
  args: {
    text: 'Add New Item',
    disabled: false,
    loading: false,
    type: 'button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with custom text instead of the default "Create Container".',
      },
    },
  },
};

export const SubmitButton: Story = {
  args: {
    text: 'Create Container',
    type: 'submit',
    disabled: false,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button configured as a submit button for forms.',
      },
    },
  },
};

export const WithCustomAriaLabel: Story = {
  args: {
    text: 'Create Container',
    'aria-label': 'Create a new farming container',
    disabled: false,
    loading: false,
    type: 'button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with custom ARIA label for improved accessibility.',
      },
    },
  },
};

export const ResponsiveDemo: Story = {
  args: {
    text: 'Create Container',
    disabled: false,
    loading: false,
    type: 'button',
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
        story: 'This story demonstrates the responsive behavior of the CreateContainer button across different screen sizes.',
      },
    },
  },
};

export const InteractionStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <CreateContainer text="Default" />
      <CreateContainer text="Loading" loading />
      <CreateContainer text="Disabled" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all interaction states: default, loading, and disabled.',
      },
    },
  },
};