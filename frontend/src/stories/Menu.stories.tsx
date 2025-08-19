import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from '../shared/components/ui/Menu';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof Menu> = {
  title: 'UI/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Menu component for displaying a popup menu with list of actions.

**Features:**
- Keyboard navigation (Arrow keys, Enter, Space, Escape)
- Responsive design with breakpoint support
- Accessibility compliant with ARIA attributes
- Theme-based styling for consistency
- Overflow handling for long menu items

**Keyboard Navigation:**
- **Arrow Up/Down**: Navigate between menu items
- **Enter/Space**: Activate selected item
- **Escape**: Close menu
- **Tab**: Close menu and continue tab navigation

**Responsive Behavior:**
- Adjusts sizing on mobile devices
- Text overflow handling with ellipsis
- Maintains minimum and maximum widths
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isVisible: {
      control: 'boolean',
      description: 'Controls menu visibility',
    },
    position: {
      control: 'object',
      description: 'Absolute positioning coordinates',
    },
    autoCloseOnSelect: {
      control: 'boolean',
      description: 'Whether menu closes when item is selected',
    },
    onClose: {
      action: 'close',
      description: 'Callback fired when menu should close',
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default menu with farming control panel items - matches Figma design
export const Default: Story = {
  args: {
    items: [
      {
        id: 'edit-settings',
        label: 'Edit & Settings',
        onClick: action('Edit & Settings clicked'),
      },
      {
        id: 'view',
        label: 'View',
        onClick: action('View clicked'),
      },
      {
        id: 'shutdown',
        label: 'Shutdown',
        onClick: action('Shutdown clicked'),
      },
    ],
    isVisible: true,
    onClose: action('Menu closed'),
    autoCloseOnSelect: true,
    'aria-label': 'Vertical Farming Control Panel Menu',
  },
};

// Hidden menu
export const Hidden: Story = {
  args: {
    ...Default.args,
    isVisible: false,
  },
};

// Menu with custom position
export const Positioned: Story = {
  args: {
    ...Default.args,
    position: {
      top: 50,
      left: 100,
    },
  },
};

// Menu with many items to test overflow
export const LongItems: Story = {
  args: {
    items: [
      {
        id: '1',
        label: 'Very Long Menu Item That Should Be Truncated',
        onClick: action('Long item clicked'),
      },
      {
        id: '2',
        label: 'Another Really Long Menu Item Name',
        onClick: action('Another long item clicked'),
      },
      {
        id: '3',
        label: 'Short',
        onClick: action('Short clicked'),
      },
      {
        id: '4',
        label: 'Extremely Long Menu Item That Definitely Exceeds Normal Width',
        onClick: action('Extremely long item clicked'),
      },
    ],
    isVisible: true,
    onClose: action('Menu closed'),
  },
};

// Menu that doesn't auto-close
export const NonAutoClosing: Story = {
  args: {
    ...Default.args,
    autoCloseOnSelect: false,
    onClose: action('Menu manually closed'),
  },
};

// Large menu with many items
export const ManyItems: Story = {
  args: {
    items: [
      { id: '1', label: 'Profile', onClick: action('Profile clicked') },
      { id: '2', label: 'Settings', onClick: action('Settings clicked') },
      { id: '3', label: 'Preferences', onClick: action('Preferences clicked') },
      { id: '4', label: 'Notifications', onClick: action('Notifications clicked') },
      { id: '5', label: 'Privacy', onClick: action('Privacy clicked') },
      { id: '6', label: 'Security', onClick: action('Security clicked') },
      { id: '7', label: 'Help & Support', onClick: action('Help clicked') },
      { id: '8', label: 'About', onClick: action('About clicked') },
      { id: '9', label: 'Logout', onClick: action('Logout clicked') },
    ],
    isVisible: true,
    onClose: action('Menu closed'),
  },
};

// Single item menu
export const SingleItem: Story = {
  args: {
    items: [
      {
        id: 'single',
        label: 'Single Action',
        onClick: action('Single Action clicked'),
      },
    ],
    isVisible: true,
    onClose: action('Menu closed'),
  },
};

// Interactive demo showing keyboard navigation
export const KeyboardNavigation: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on the menu to focus it, then use arrow keys to navigate and Enter/Space to select items.',
      },
    },
  },
};