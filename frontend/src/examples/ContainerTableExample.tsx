import React, { useState } from 'react';
import { Box, Typography, Paper, Menu, MenuItem } from '@mui/material';
import { 
  ContainerTable, 
  ContainerRowData 
} from '../shared/components/ui/ContainerTable';

// Sample data for the example
const sampleContainers: ContainerRowData[] = [
  {
    type: 'virtual-farm',
    name: 'virtual-farm-04',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Agriville, USA',
    status: 'Connected',
    created: '30/01/2025',
    modified: '30/01/2025',
    hasAlerts: true,
  },
  {
    type: 'virtual-farm',
    name: 'virtual-farm-03',
    tenant: 'tenant-222',
    purpose: 'Research',
    location: 'Farmington, USA',
    status: 'Maintenance',
    created: '30/01/2025',
    modified: '30/01/2025',
    hasAlerts: false,
  },
  {
    type: 'farm-container',
    name: 'farm-container-04',
    tenant: 'tenant-222',
    purpose: 'Research',
    location: 'Techville, Canada',
    status: 'Created',
    created: '25/01/2025',
    modified: '26/01/2025',
    hasAlerts: false,
  },
  {
    type: 'farm-container',
    name: 'farm-container-07',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Agriville, USA',
    status: 'Connected',
    created: '25/01/2025',
    modified: '26/01/2025',
    hasAlerts: false,
  },
  {
    type: 'virtual-farm',
    name: 'virtual-farm-02',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Croptown, USA',
    status: 'Inactive',
    created: '13/01/2025',
    modified: '15/01/2025',
    hasAlerts: true,
  },
  {
    type: 'farm-container',
    name: 'farm-container-06',
    tenant: 'tenant-5',
    purpose: 'Research',
    location: 'Scienceville, Germany',
    status: 'Connected',
    created: '12/01/2025',
    modified: '18/01/2025',
    hasAlerts: false,
  },
];

const ContainerTableExample: React.FC = () => {
  // State for the context menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContainer, setSelectedContainer] = useState<ContainerRowData | null>(null);
  
  // Handler for opening the action menu
  const handleActionClick = (container: ContainerRowData, index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedContainer(container);
  };
  
  // Handler for closing the menu
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedContainer(null);
  };
  
  // Handler for menu item clicks
  const handleMenuItemClick = (action: string) => {
    if (selectedContainer) {
      console.log(`Action "${action}" for container: ${selectedContainer.name}`);
      // Implement actual action logic here
    }
    handleMenuClose();
  };
  
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Container Management</Typography>
      
      <Paper elevation={0} sx={{ p: 2, mb: 4 }}>
        <Typography variant="body1" paragraph>
          This example demonstrates the ContainerTable component displaying container information
          with type icons, status indicators, and interactive action buttons.
        </Typography>
      </Paper>
      
      <ContainerTable
        rows={sampleContainers}
        zebraStriping
        maxHeight={500}
        stickyHeader
        onActionClick={(container, index) => (event: React.MouseEvent<HTMLButtonElement>) => 
          handleActionClick(container, index, event)
        }
      />
      
      {/* Context menu for container actions */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuItemClick('view')}>View Details</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('edit')}>Edit</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('restart')}>Restart</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('delete')} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ContainerTableExample;