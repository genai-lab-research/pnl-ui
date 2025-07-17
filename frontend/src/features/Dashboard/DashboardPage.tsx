import React from 'react';
import { Box, Typography, Container } from '@mui/material';

interface DashboardPageProps {
  className?: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ className }) => {
  return (
    <Container maxWidth="xl" className={className}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the main dashboard overview.
        </Typography>
      </Box>
    </Container>
  );
};

export default DashboardPage;