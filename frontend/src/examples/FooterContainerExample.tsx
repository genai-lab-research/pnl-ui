import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { FooterContainer } from '../shared/components/ui/FooterContainer';

/**
 * Example component demonstrating how to use the FooterContainer component
 */
const FooterContainerExample: React.FC = () => {
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleProvision = () => {
    setActionMessage('Provision & Print ID action triggered');
    // Simulate an API call or other action
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleClose = () => {
    setActionMessage('Close action triggered');
    // Simulate an action
    setTimeout(() => setActionMessage(null), 3000);
  };

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Footer Container Example
      </Typography>
      
      <Typography variant="body1" paragraph>
        This example demonstrates the FooterContainer component with different configurations.
      </Typography>
      
      {actionMessage && (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: '#e3f2fd', 
            color: 'primary.main' 
          }}
        >
          <Typography>{actionMessage}</Typography>
        </Paper>
      )}
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Default Footer Container
      </Typography>
      <FooterContainer
        primaryActionLabel="Provision & Print ID"
        secondaryActionLabel="Close"
        onPrimaryAction={handleProvision}
        onSecondaryAction={handleClose}
      />
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Footer Container with Only Close Button
      </Typography>
      <FooterContainer
        secondaryActionLabel="Close"
        onSecondaryAction={handleClose}
      />
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Footer Container with Additional Content
      </Typography>
      <FooterContainer
        primaryActionLabel="Provision & Print ID"
        secondaryActionLabel="Close"
        onPrimaryAction={handleProvision}
        onSecondaryAction={handleClose}
      >
        <Typography variant="body2" color="text.secondary">
          3 containers selected for provisioning
        </Typography>
      </FooterContainer>
    </Box>
  );
};

export default FooterContainerExample;