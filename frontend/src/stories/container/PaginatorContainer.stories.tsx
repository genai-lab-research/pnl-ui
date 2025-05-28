import type { Meta, StoryObj } from '@storybook/react';

import { PaginatorContainer } from '../../shared/components/ui/Container';

const meta = {
  title: 'Container/PaginatorContainer',
  component: PaginatorContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PaginatorContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 2,
    disablePrevious: true,
    disableNext: false,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    disablePrevious: false,
    disableNext: false,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 3,
    totalPages: 3,
    disablePrevious: false,
    disableNext: true,
  },
};
