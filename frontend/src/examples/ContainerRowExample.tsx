import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableContainer, 
  TableHead,
  TableRow,
  TableCell,
  Paper, 
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import ContainerRow, { ContainerRowData } from '../shared/components/ui/ContainerRow';

const ContainerRowExample: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowIndex(index);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowIndex(null);
  };
  
  const handleAction = (action: string) => {
    console.log(`${action} on row ${selectedRowIndex}`);
    handleMenuClose();
  };
  
  // Sample data for demonstration
  const containerData: ContainerRowData[] = [
    {
      isVirtualFarm: true,
      name: 'virtual-farm-04',
      environments: ['PROD', 'DEV'],
      tenant: 'tenant-123',
      purpose: 'Development',
      location: 'Agriville, USA',
      status: 'Connected',
      created: '30/01/2025',
      modified: '30/01/2025',
      hasAlerts: true,
    },
    {
      isVirtualFarm: false,
      name: 'container-abc',
      environments: ['PROD'],
      tenant: 'tenant-456',
      purpose: 'Production',
      location: 'Farmville, USA',
      status: 'Inactive',
      created: '15/01/2025',
      modified: '28/01/2025',
      hasAlerts: false,
    },
    {
      isVirtualFarm: true,
      name: 'virtual-farm-07',
      environments: ['DEV'],
      tenant: 'tenant-789',
      purpose: 'Research',
      location: 'Techcity, Canada',
      status: 'Maintenance',
      created: '10/01/2025',
      modified: '20/01/2025',
      hasAlerts: true,
    }
  ];
  
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Container Rows Example
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={48}></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Environment</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Modified</TableCell>
              <TableCell width={48}></TableCell>
              <TableCell width={48}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {containerData.map((container, index) => (
              <ContainerRow
                key={index}
                data={container}
                isStriped={index % 2 === 1}
                onActionsClick={(e) => handleMenuOpen(e, index)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('View')}>View Details</MenuItem>
        <MenuItem onClick={() => handleAction('Edit')}>Edit</MenuItem>
        <MenuItem onClick={() => handleAction('Delete')}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default ContainerRowExample;