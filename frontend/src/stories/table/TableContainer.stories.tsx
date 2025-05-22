import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { TableContainer } from '../../shared/components/ui/Table/TableContainer';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const meta: Meta<typeof TableContainer> = {
  title: 'Table/TableContainer',
  component: TableContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TableContainer>;

// Create sample table data
const sampleData = [
  { id: 1, name: 'Salanova Cousteau', area: 40, table: 30, date: '2025-01-30' },
  { id: 2, name: 'Kiribati', area: 50, table: 20, date: '2025-01-30' },
  { id: 3, name: 'Rex Butterhead', area: 65, table: 10, date: '2025-01-10' },
  { id: 4, name: 'Lollo Rossa', area: 35, table: 25, date: '2025-01-15' },
];

export const Default: Story = {
  args: {
    children: (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Seed Type</TableCell>
            <TableCell>Cultivation Area</TableCell>
            <TableCell>Nursery Table</TableCell>
            <TableCell>Last SD</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.area}</TableCell>
              <TableCell>{row.table}</TableCell>
              <TableCell>{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
  },
};

export const Elevated: Story = {
  args: {
    elevated: true,
    children: (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Seed Type</TableCell>
            <TableCell>Cultivation Area</TableCell>
            <TableCell>Nursery Table</TableCell>
            <TableCell>Last SD</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.area}</TableCell>
              <TableCell>{row.table}</TableCell>
              <TableCell>{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
  },
};

export const NoBorder: Story = {
  args: {
    bordered: false,
    children: (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Seed Type</TableCell>
            <TableCell>Cultivation Area</TableCell>
            <TableCell>Nursery Table</TableCell>
            <TableCell>Last SD</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.area}</TableCell>
              <TableCell>{row.table}</TableCell>
              <TableCell>{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
  },
};