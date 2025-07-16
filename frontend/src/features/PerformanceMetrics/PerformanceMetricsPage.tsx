import React from 'react';
import { Box, Typography, Container } from '@mui/material';

interface PerformanceMetricsPageProps {
  className?: string;
}

const PerformanceMetricsPage: React.FC<PerformanceMetricsPageProps> = ({ className }) => {
  return (
    <Container maxWidth="xl" className={className}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Performance Metrics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View performance analytics and metrics for your containers.
        </Typography>
      </Box>
    </Container>
  );
};

export default PerformanceMetricsPage;