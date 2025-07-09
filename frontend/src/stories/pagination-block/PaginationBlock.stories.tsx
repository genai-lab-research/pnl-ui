import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { useState } from 'react';

import { PaginationBlock } from '../../shared/components/ui/PaginationBlock';

const meta: Meta<typeof PaginationBlock> = {
  title: 'UI/PaginationBlock',
  component: PaginationBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PaginationBlock>;

const PaginationBlockWithState = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 5;
  
  return (
    <PaginationBlock
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
};

export const Default: Story = {
  render: () => <PaginationBlockWithState />,
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