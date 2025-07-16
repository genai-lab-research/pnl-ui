import React from 'react';
import { Box, Typography, Container } from '@mui/material';

interface ContainerListingPageProps {
  className?: string;
}

const ContainerListingPage: React.FC<ContainerListingPageProps> = ({ className }) => {
  return (
    <Container maxWidth="xl" className={className}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Container Listing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and manage all containers in the system.
        </Typography>
      </Box>
    </Container>
  );
};

export default ContainerListingPage;