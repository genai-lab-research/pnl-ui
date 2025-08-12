import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ContainerOverviewContainer } from '../../containers/ContainerOverviewContainer';
import { containerOverviewPageStyles } from './ContainerOverviewPage.styles';

export const ContainerOverviewPage: React.FC = () => {
  const { containerId, tab } = useParams<{
    containerId?: string;
    tab?: string;
  }>();

  // Validate containerId parameter
  const containerIdNum = parseInt(containerId || '', 10);
  if (!containerId || isNaN(containerIdNum)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Validate tab parameter
  const validTabs = ['overview', 'environment', 'inventory', 'devices'];
  const activeTab = tab && validTabs.includes(tab) ? tab : 'overview';

  return (
    <Box sx={containerOverviewPageStyles.root}>
      <ContainerOverviewContainer
        containerId={containerIdNum}
        initialTab={activeTab as 'overview' | 'environment' | 'inventory' | 'devices'}
      />
    </Box>
  );
};
