import React, { useState } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { ContainerCreationDrawer } from './ContainerCreationDrawer';
import { ContainerFormData } from './types';

/**
 * Demo page for the Container Creation Drawer
 * Shows the drawer functionality in isolation
 */
export const ContainerCreationDemo: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleContainerCreated = (containerData: ContainerFormData) => {
    console.log('Container created:', containerData);
    // In a real app, this would trigger a refresh of the container list
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Container Creation Demo
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Click the button below to open the container creation drawer
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => setDrawerOpen(true)}
          sx={{
            minWidth: 200,
            height: 48
          }}
        >
          Create Container
        </Button>
      </Box>

      <ContainerCreationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onContainerCreated={handleContainerCreated}
      />
    </Container>
  );
};