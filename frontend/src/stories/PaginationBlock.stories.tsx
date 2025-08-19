import type { Meta, StoryObj } from '@storybook/react';
import { PaginationBlock } from '../shared/components/ui/PaginationBlock';

const meta: Meta<typeof PaginationBlock> = {
  title: 'UI/PaginationBlock',
  component: PaginationBlock,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Pagination component for navigating through pages with Previous/Next controls and page status display.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current page number',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    isPreviousDisabled: {
      control: 'boolean',
      description: 'Whether the Previous button is disabled',
    },
    isNextDisabled: {
      control: 'boolean',
      description: 'Whether the Next button is disabled',
    },
    onPreviousClick: {
      action: 'previous-clicked',
      description: 'Handler for Previous button click',
    },
    onNextClick: {
      action: 'next-clicked',
      description: 'Handler for Next button click',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 2,
    isPreviousDisabled: false,
    isNextDisabled: false,
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    isPreviousDisabled: true,
    isNextDisabled: false,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 5,
    totalPages: 5,
    isPreviousDisabled: false,
    isNextDisabled: true,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    isPreviousDisabled: false,
    isNextDisabled: false,
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    isPreviousDisabled: true,
    isNextDisabled: true,
  },
};

export const LargePageNumbers: Story = {
  args: {
    currentPage: 152,
    totalPages: 999,
    isPreviousDisabled: false,
    isNextDisabled: false,
  },
};