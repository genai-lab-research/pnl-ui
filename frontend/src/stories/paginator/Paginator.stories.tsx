import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Paginator } from '../../shared/components/ui/Paginator';

const meta: Meta<typeof Paginator> = {
  title: 'UI/Paginator',
  component: Paginator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Paginator>;

const PaginatorWithState = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 5;
  
  return (
    <Paginator
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
};

export const Default: Story = {
  render: () => <PaginatorWithState />,
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: () => {},
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: () => {},
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    onPageChange: () => {},
  },
};