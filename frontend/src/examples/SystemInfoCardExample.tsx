import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { SystemInfoCard } from '../shared/components/ui/SystemInfoCard';

/**
 * Example component that demonstrates the usage of SystemInfoCard component
 * with sample data that matches the design specification from Figma
 */
const SystemInfoCardExample: React.FC = () => {
  const theme = useTheme();
  
  // Example system settings data
  const systemSettingsData = {
    title: 'System Settings',
    subtitle: 'Create or deactivate a digital shadow for farm-container-04.',
    groups: [
      {
        title: 'Container Options',
        items: [
          { name: 'Enable Shadow Service', value: 'No' },
        ],
      },
      {
        title: 'System Integration',
        items: [
          { name: 'Connect to external systems', value: 'Yes' },
          { 
            name: 'FA Integration', 
            value: 'Alpha', 
            isLink: true,
            linkUrl: '#' 
          },
          { 
            name: 'FA Integration', 
            value: 'Dev', 
            isLink: true,
            linkUrl: '#' 
          },
          { 
            name: 'AWS Environment', 
            value: 'Dev', 
            isLink: true,
            linkUrl: '#' 
          },
          { 
            name: 'MBAI Environment', 
            value: 'Disabled', 
            isLink: true,
            linkUrl: '#' 
          },
        ],
      },
    ],
  };

  return (
    <Container maxWidth="md" sx={{ py: theme.spacing(4) }}>
      <Typography variant="h4" component="h1" gutterBottom>
        System Info Card Example
      </Typography>
      
      <Box sx={{ mb: theme.spacing(4) }}>
        <Typography variant="body1" paragraph>
          This example demonstrates the SystemInfoCard component displaying system settings
          with different groups of configuration options.
        </Typography>
      </Box>
      
      <SystemInfoCard
        title={systemSettingsData.title}
        subtitle={systemSettingsData.subtitle}
        groups={systemSettingsData.groups}
      />
    </Container>
  );
};

export default SystemInfoCardExample;