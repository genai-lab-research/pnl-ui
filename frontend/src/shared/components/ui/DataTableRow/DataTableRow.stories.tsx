import type { Meta, StoryObj } from '@storybook/react';
import { DataTableRow } from './DataTableRow';
import { CellData } from './types';

const meta: Meta<typeof DataTableRow> = {
  title: 'Components/DataTableRow',
  component: DataTableRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'bordered', 'elevated'],
    },
    selected: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    clickable: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data matching the original Figma design
const originalDesignCells: CellData[] = [
  {
    id: 'name',
    type: 'text',
    content: 'Rex Butterhead',
    fontWeight: 'medium',
    flex: true,
    alignment: 'left',
    ariaLabel: 'Name',
  },
  {
    id: 'tenant',
    type: 'text',
    content: '65',
    width: 150,
    alignment: 'center',
    ariaLabel: 'Tenant ID',
  },
  {
    id: 'blocks',
    type: 'text',
    content: '10',
    width: 150,
    alignment: 'center',
    ariaLabel: 'Blocks',
  },
  {
    id: 'seedDate',
    type: 'text',
    content: '2025-01-10',
    width: 140,
    alignment: 'center',
    ariaLabel: 'Seed Date',
  },
  {
    id: 'harvestDate',
    type: 'text',
    content: '2025-01-20',
    width: 140,
    alignment: 'center',
    ariaLabel: 'Harvest Date',
  },
  {
    id: 'shipDate',
    type: 'text',
    content: '2025-01-01',
    width: 140,
    alignment: 'center',
    ariaLabel: 'Ship Date',
  },
  {
    id: 'shelf',
    type: 'text',
    content: '22',
    width: 130,
    alignment: 'center',
    ariaLabel: 'Shelf Number',
  },
  {
    id: 'status',
    type: 'status',
    content: '0',
    statusVariant: 'active',
    width: 130,
    alignment: 'center',
    ariaLabel: 'Status',
  },
];

// Generic reusable data examples
const userDataCells: CellData[] = [
  {
    id: 'name',
    type: 'text',
    content: 'Sarah Johnson',
    fontWeight: 'medium',
    flex: true,
    alignment: 'left',
  },
  {
    id: 'email',
    type: 'text',
    content: 'sarah.johnson@example.com',
    flex: true,
    alignment: 'left',
  },
  {
    id: 'role',
    type: 'text',
    content: 'Administrator',
    width: 120,
    alignment: 'center',
  },
  {
    id: 'status',
    type: 'status',
    content: 'Active',
    statusVariant: 'active',
    width: 100,
    alignment: 'center',
  },
];

const productDataCells: CellData[] = [
  {
    id: 'name',
    type: 'text',
    content: 'Smart Monitor Pro',
    fontWeight: 'medium',
    flex: true,
    alignment: 'left',
  },
  {
    id: 'sku',
    type: 'text',
    content: 'SMP-2024-001',
    width: 120,
    alignment: 'center',
  },
  {
    id: 'price',
    type: 'text',
    content: '$299.99',
    width: 100,
    alignment: 'right',
  },
  {
    id: 'stock',
    type: 'text',
    content: '45',
    width: 80,
    alignment: 'center',
  },
  {
    id: 'status',
    type: 'status',
    content: 'In Stock',
    statusVariant: 'active',
    width: 100,
    alignment: 'center',
  },
];

export const OriginalDesign: Story = {
  args: {
    cells: originalDesignCells,
    variant: 'bordered',
    size: 'md',
    clickable: true,
  },
};

export const UserManagement: Story = {
  args: {
    cells: userDataCells,
    variant: 'default',
    size: 'md',
    clickable: true,
  },
};

export const ProductCatalog: Story = {
  args: {
    cells: productDataCells,
    variant: 'elevated',
    size: 'md',
    clickable: true,
  },
};

export const Selected: Story = {
  args: {
    cells: originalDesignCells,
    variant: 'bordered',
    size: 'md',
    selected: true,
    clickable: true,
  },
};

export const Disabled: Story = {
  args: {
    cells: originalDesignCells,
    variant: 'bordered',
    size: 'md',
    disabled: true,
    clickable: true,
  },
};

export const Loading: Story = {
  args: {
    cells: originalDesignCells,
    variant: 'bordered',
    size: 'md',
    loading: true,
  },
};

export const Error: Story = {
  args: {
    cells: originalDesignCells,
    variant: 'bordered',
    size: 'md',
    error: 'Failed to load data',
  },
};

export const SmallSize: Story = {
  args: {
    cells: originalDesignCells,
    variant: 'bordered',
    size: 'sm',
    clickable: true,
  },
};

export const LargeSize: Story = {
  args: {
    cells: originalDesignCells,
    variant: 'bordered',
    size: 'lg',
    clickable: true,
  },
};

export const StatusVariants: Story = {
  args: {
    cells: [
      { id: 'label1', type: 'text', content: 'Active Status', width: 150 },
      { id: 'status1', type: 'status', content: 'Active', statusVariant: 'active', width: 100 },
      { id: 'label2', type: 'text', content: 'Warning Status', width: 150 },
      { id: 'status2', type: 'status', content: 'Warning', statusVariant: 'warning', width: 100 },
      { id: 'label3', type: 'text', content: 'Error Status', width: 150 },
      { id: 'status3', type: 'status', content: 'Error', statusVariant: 'error', width: 100 },
      { id: 'label4', type: 'text', content: 'Inactive Status', width: 150 },
      { id: 'status4', type: 'status', content: 'Inactive', statusVariant: 'inactive', width: 100 },
    ],
    variant: 'bordered',
    size: 'md',
  },
};
