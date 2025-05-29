import type { Meta, StoryObj } from '@storybook/react';
import { TableHeader } from '../../shared/components/ui/TableHeader';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

const meta = {
  title: 'UI/TableHeader',
  component: TableHeader,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
  argTypes: {
    headerBgColor: {
      control: 'color',
      description: 'Background color of the table header',
    },
    headerTextColor: {
      control: 'color',
      description: 'Text color of the table header',
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Whether to make the table header sticky when scrolling',
    },
  },
  decorators: [
    (Story) => (
      <TableContainer component={Paper} style={{ width: '100%', maxWidth: 800 }}>
        <Table>
          <Story />
          <TableBody>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Modified</TableCell>
              <TableCell>Alerts</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    ),
  ],
} satisfies Meta<typeof TableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns = [
  { id: 'type', label: 'Type', width: '8%' },
  { id: 'name', label: 'Name', width: '12%' },
  { id: 'tenant', label: 'Tenant', width: '10%' },
  { id: 'purpose', label: 'Purpose', width: '10%' },
  { id: 'location', label: 'Location', width: '15%' },
  { id: 'status', label: 'Status', width: '10%' },
  { id: 'created', label: 'Created', width: '10%' },
  { id: 'modified', label: 'Modified', width: '10%' },
  { id: 'alerts', label: 'Alerts', width: '8%', align: 'center' as const },
  { id: 'actions', label: 'Actions', width: '7%', align: 'center' as const },
];

export const Default: Story = {
  args: {
    columns,
    headerBgColor: '#F5F5F7',
    headerTextColor: 'rgba(76, 78, 100, 0.87)',
    stickyHeader: false,
  },
};

export const CustomColors: Story = {
  args: {
    columns,
    headerBgColor: '#e0eafc',
    headerTextColor: '#1a3b7a',
    stickyHeader: false,
  },
};

export const WithStickyHeader: Story = {
  args: {
    columns,
    headerBgColor: '#F5F5F7',
    headerTextColor: 'rgba(76, 78, 100, 0.87)',
    stickyHeader: true,
  },
};

export const PixelPerfectMatch: Story = {
  args: {
    columns: [
      { id: 'type', label: 'Type' },
      { id: 'name', label: 'Name' },
      { id: 'tenant', label: 'Tenant' },
      { id: 'purpose', label: 'Purpose' },
      { id: 'location', label: 'Location' },
      { id: 'status', label: 'Status' },
      { id: 'created', label: 'Created' },
      { id: 'modified', label: 'Modified' },
      { id: 'alerts', label: 'Alerts' },
      { id: 'actions', label: 'Actions' },
    ],
    headerBgColor: '#F5F5F7',
    headerTextColor: 'rgba(76, 78, 100, 0.87)',
  },
};
