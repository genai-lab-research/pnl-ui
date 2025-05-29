import React from 'react';
import { TableHeader } from '../shared/components/ui/TableHeader';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

const TableHeaderExample: React.FC = () => {
  // Define columns for the table header
  const columns = [
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
  ];

  // Sample data rows
  const rows = [
    {
      type: 'Type A',
      name: 'Sample Name 1',
      tenant: 'Tenant 1',
      purpose: 'Development',
      location: 'US East',
      status: 'Active',
      created: '2025-01-15',
      modified: '2025-01-30',
      alerts: '0',
      actions: 'View',
    },
    {
      type: 'Type B',
      name: 'Sample Name 2',
      tenant: 'Tenant 2',
      purpose: 'Testing',
      location: 'US West',
      status: 'Inactive',
      created: '2025-01-10',
      modified: '2025-01-25',
      alerts: '2',
      actions: 'View',
    },
    {
      type: 'Type C',
      name: 'Sample Name 3',
      tenant: 'Tenant 3',
      purpose: 'Production',
      location: 'EU Central',
      status: 'Active',
      created: '2025-01-05',
      modified: '2025-01-20',
      alerts: '1',
      actions: 'View',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>TableHeader Example</h2>
      <p>This example demonstrates the TableHeader component with a complete table implementation.</p>
      
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHeader 
            columns={columns} 
            headerBgColor="#F5F5F7"
            headerTextColor="rgba(76, 78, 100, 0.87)"
          />
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map(column => (
                  <TableCell key={column.id}>
                    {row[column.id as keyof typeof row]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: '40px' }}>
        <h3>Custom Styling Example</h3>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHeader 
              columns={columns} 
              headerBgColor="#e0eafc"
              headerTextColor="#1a3b7a"
            />
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  {columns.map(column => (
                    <TableCell key={column.id}>
                      {row[column.id as keyof typeof row]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default TableHeaderExample;
