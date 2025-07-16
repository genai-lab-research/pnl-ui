import React from 'react';
import { Box, Typography, Container } from '@mui/material';

interface ContainerDetailsPageProps {
  className?: string;
}

const ContainerDetailsPage: React.FC<ContainerDetailsPageProps> = ({ className }) => {
  return (
    <Container maxWidth="xl" className={className}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Container Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View detailed information about a specific container.
        </Typography>
      </Box>
    </Container>
  );
};

export default ContainerDetailsPage;