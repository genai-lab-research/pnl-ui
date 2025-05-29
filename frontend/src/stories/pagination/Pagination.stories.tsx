import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '../../shared/components/ui/Pagination';
import { Box } from '@mui/material';

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Pagination component for navigating through pages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    page: {
      control: { type: 'number', min: 1 },
      description: 'Current page number',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    showingText: {
      control: 'text',
      description: 'Text to display before page information',
    },
    fullWidth: {
      control: 'boolean',
      description: 'If true, the component will take the full width of its container',
    },
    onPageChange: {
      action: 'page changed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

// Interactive story with state
const InteractivePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <Pagination
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};

export const Default: Story = {
  args: {
    page: 1,
    totalPages: 10,
    showingText: 'Showing page',
    fullWidth: false,
  },
};

export const Interactive = {
  render: () => <InteractivePagination />,
};

export const FirstPage: Story = {
  args: {
    page: 1,
    totalPages: 10,
    showingText: 'Showing page',
  },
};

export const MiddlePage: Story = {
  args: {
    page: 5,
    totalPages: 10,
    showingText: 'Showing page',
  },
};

export const LastPage: Story = {
  args: {
    page: 10,
    totalPages: 10,
    showingText: 'Showing page',
  },
};

export const CustomLabel: Story = {
  args: {
    page: 3,
    totalPages: 5,
    showingText: 'Page',
  },
};

export const FullWidth: Story = {
  args: {
    page: 2,
    totalPages: 6,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '100%', maxWidth: '800px', border: '1px dashed #ccc', padding: 2 }}>
        <Story />
      </Box>
    ),
  ],
};

export const ResponsiveView: Story = {
  args: {
    page: 2,
    totalPages: 6,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};