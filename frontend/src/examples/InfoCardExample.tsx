import React from 'react';
import { Box, Container, Typography, Paper, Stack } from '@mui/material';
import { InfoCard, ContainerInfoData } from '../shared/components/ui/InfoCard';
import StorageIcon from '@mui/icons-material/Storage';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// Sample container data
const sampleContainerData: ContainerInfoData = {
  name: 'farm-container-04',
  id: '51',
  type: 'Physical',
  tenant: 'tenant-123',
  purpose: 'Development',
  location: 'Lviv',
  status: 'active',
  created: '30/01/2025, 09:30',
  lastModified: '30/01/2025, 11:14',
  creator: 'Mia Adams',
  seedTypes: 'Someroots, sunflower, Someroots, Someroots',
  notes: 'Primary production container for Farm A.',
  typeIcon: <LocalShippingIcon fontSize="small" sx={{ color: '#000000' }} />,
};

// Additional container for demonstration
const secondContainerData: ContainerInfoData = {
  name: 'farm-container-05',
  id: '52',
  type: 'Virtual',
  tenant: 'tenant-456',
  purpose: 'Testing',
  location: 'Kyiv',
  status: 'inactive',
  created: '15/02/2025, 14:22',
  lastModified: '16/02/2025, 09:45',
  creator: 'John Smith',
  seedTypes: 'Alfalfa, Wheat, Barley',
  notes: 'Test environment for new seed varieties.',
  typeIcon: <FormatListBulletedIcon fontSize="small" sx={{ color: '#000000' }} />,
};

/**
 * Example component showcasing the InfoCard component with sample data
 */
const InfoCardExample: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Container Information Cards
      </Typography>
      
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Active Container
          </Typography>
          <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 2 }}>
            <InfoCard containerData={sampleContainerData} />
          </Paper>
        </Box>
        
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Inactive Container
          </Typography>
          <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 2 }}>
            <InfoCard containerData={secondContainerData} />
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
};

export default InfoCardExample;