import { Meta, StoryObj } from '@storybook/react';
import { GenerationBlock } from '../GenerationBlock';

const meta = {
  title: 'Shared/Components/GenerationBlock',
  component: GenerationBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GenerationBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Physical container | Tenant-123 | Development',
    status: {
      label: 'Active',
      type: 'active',
    },
  },
};

export const Inactive: Story = {
  args: {
    label: 'Physical container | Tenant-123 | Development',
    status: {
      label: 'Inactive',
      type: 'inactive',
    },
  },
};

export const Error: Story = {
  args: {
    label: 'Physical container | Tenant-123 | Development',
    status: {
      label: 'Error',
      type: 'error',
    },
  },
};

export const Warning: Story = {
  args: {
    label: 'Physical container | Tenant-123 | Development',
    status: {
      label: 'Warning',
      type: 'warning',
    },
  },
};

export const CustomIcon: Story = {
  args: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 6L8 1L14 6V13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V6Z" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 14V8H10V14" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Custom icon | Tenant-456 | Production',
    status: {
      label: 'Active',
      type: 'active',
    },
  },
};