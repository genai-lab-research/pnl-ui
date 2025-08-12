import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import TablePagination from './TablePagination';

const meta = {
  title: 'UI/TablePagination',
  component: TablePagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A reusable table pagination component that provides navigation controls for paginated data.

## Features
- Responsive design that adapts to different screen sizes
- Customizable page info display (left, center, or both)
- Configurable button labels and icons
- Multiple size variants (sm, md, lg)
- Loading and error states
- Keyboard accessibility
- Auto-disabled state management for prev/next buttons

## Usage
Perfect for tables, lists, and any paginated content where users need to navigate between pages of data.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current page number (1-based)',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'outlined'],
      description: 'Visual variant',
    },
    showLeftPageInfo: {
      control: { type: 'boolean' },
      description: 'Show page info on the left side',
    },
    showCenterPageInfo: {
      control: { type: 'boolean' },
      description: 'Show page info in the center',
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
    onPrevious: fn(),
    onNext: fn(),
  },
} satisfies Meta<typeof TablePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default pagination example
export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 2,
    showLeftPageInfo: true,
    showCenterPageInfo: true,
  },
};

// Product catalog pagination
export const ProductCatalog: Story = {
  args: {
    currentPage: 3,
    totalPages: 15,
    pageInfoFormat: (current, total) => `Page ${current} of ${total}`,
    previousLabel: 'Previous',
    nextLabel: 'Next',
    showLeftPageInfo: true,
    showCenterPageInfo: false,
  },
};

// User list pagination
export const UserList: Story = {
  args: {
    currentPage: 7,
    totalPages: 12,
    pageInfoFormat: (current, total) => `Displaying page ${current} out of ${total}`,
    previousLabel: 'Back',
    nextLabel: 'Forward',
    showLeftPageInfo: false,
    showCenterPageInfo: true,
  },
};

// Order history pagination
export const OrderHistory: Story = {
  args: {
    currentPage: 2,
    totalPages: 8,
    pageInfoFormat: (current, total) => `Viewing ${current} / ${total}`,
    showLeftPageInfo: true,
    showCenterPageInfo: false,
  },
};

// Small size variant
export const SmallSize: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    size: 'sm',
  },
};

// Large size variant
export const LargeSize: Story = {
  args: {
    currentPage: 2,
    totalPages: 10,
    size: 'lg',
  },
};

// First page (previous disabled)
export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
  },
};

// Last page (next disabled)
export const LastPage: Story = {
  args: {
    currentPage: 5,
    totalPages: 5,
  },
};

// Single page (both disabled)
export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    loading: true,
  },
};

// Error state
export const Error: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    error: 'Failed to load pagination data',
  },
};

// Minimal layout (center only)
export const MinimalLayout: Story = {
  args: {
    currentPage: 3,
    totalPages: 7,
    showLeftPageInfo: false,
    showCenterPageInfo: true,
  },
};

// Custom format example
export const CustomFormat: Story = {
  args: {
    currentPage: 4,
    totalPages: 20,
    pageInfoFormat: (current, total) => `Step ${current} of ${total} steps`,
    previousLabel: '← Prev',
    nextLabel: 'Next →',
  },
};