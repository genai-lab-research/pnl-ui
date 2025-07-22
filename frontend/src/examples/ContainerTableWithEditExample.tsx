import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ContainerTable } from '../shared/components/ui/ContainerTable';
import { Container } from '../shared/types/containers';

/**
 * Example demonstrating ContainerTable integration with EditContainerPanel
 * Shows how the edit functionality works via the dropdown menu
 */
export const ContainerTableWithEditExample: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([
    {
      id: 'container-1',
      name: 'farm-container-01',
      tenant: 'tenant-23',
      type: 'physical',
      purpose: 'production',
      location: {
        city: 'San Francisco',
        country: 'USA',
        address: 'Farm Facility A'
      },
      status: 'active',
      seed_types: [
        { id: 1, name: 'Someroots', variety: 'V1', supplier: 'Supplier A', batch_id: 'B001' },
        { id: 2, name: 'sunflower', variety: 'Standard', supplier: 'Supplier B', batch_id: 'B002' }
      ],
      created: '2024-01-15T10:30:00Z',
      modified: '2024-01-20T14:45:00Z',
      has_alert: false,
      notes: 'Primary production container for Farm A.',
      shadow_service_enabled: true,
      ecosystem_connected: false
    },
    {
      id: 'container-2',
      name: 'farm-container-02',
      tenant: 'tenant-45',
      type: 'virtual',
      purpose: 'development',
      location: {
        city: 'New York',
        country: 'USA',
        address: 'Development Lab B'
      },
      status: 'connected',
      seed_types: [
        { id: 2, name: 'sunflower', variety: 'Standard', supplier: 'Supplier B', batch_id: 'B002' },
        { id: 3, name: 'basil', variety: 'Genovese', supplier: 'Supplier C', batch_id: 'B003' }
      ],
      created: '2024-01-10T08:15:00Z',
      modified: '2024-01-22T16:30:00Z',
      has_alert: true,
      notes: 'Development container for testing new configurations.',
      shadow_service_enabled: false,
      ecosystem_connected: true
    }
  ]);

  const handleRowAction = (container: Container, action: string) => {
    console.log(`Action "${action}" triggered for container:`, container.name);
    // Handle other actions like view, shutdown, etc.
  };

  const handleContainerUpdated = (updatedContainer: Container) => {
    console.log('Container updated:', updatedContainer);
    
    // Update the container in the local state
    setContainers(prev => 
      prev.map(container => 
        container.id === updatedContainer.id ? updatedContainer : container
      )
    );
    
    // Show success notification (in real app, you'd use a toast/snackbar)
    alert(`Container "${updatedContainer.name}" has been updated successfully!`);
  };

  return (
    <Box sx={{ padding: '2rem', backgroundColor: '#F7F9FD', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ marginBottom: '2rem', fontWeight: 600 }}>
        Container Table with Edit Integration
      </Typography>
      
      <Typography variant="body1" sx={{ marginBottom: '1rem', color: '#666' }}>
        Click the three-dot menu (⋮) next to any container to access the dropdown menu.
        Select "Edit & Settings" to open the EditContainerPanel.
      </Typography>

      <Box sx={{ 
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0px 0px 2px rgba(65, 64, 69, 1)',
        padding: '24px'
      }}>
        <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
          Container List
        </Typography>
        
        <ContainerTable
          containers={containers}
          onRowAction={handleRowAction}
          onContainerUpdated={handleContainerUpdated}
        />
      </Box>

      <Box sx={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#E3F2FD',
        borderRadius: '4px',
        border: '1px solid #BBDEFB'
      }}>
        <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>
          How to test:
        </Typography>
        <Typography variant="body2" component="div">
          <ol>
            <li>Click the three-dot menu (⋮) in the Actions column</li>
            <li>Select "Edit & Settings" from the dropdown</li>
            <li>The EditContainerPanel will slide in from the right</li>
            <li>Make changes to the container configuration</li>
            <li>Click "Save" to update the container</li>
            <li>The table will reflect the updated container data</li>
          </ol>
        </Typography>
      </Box>
    </Box>
  );
};

export default ContainerTableWithEditExample;