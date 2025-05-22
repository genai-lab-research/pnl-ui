import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Components
import { NavigationBar } from '../shared/components/layout';

// Pages
import { ContainerListPage } from '../features/containers';
import { ContainerMetricsPage } from '../features/metrics';
import { ExampleFeature } from '../features/example';
import { ContainerManagementDashboard } from '../features/container-management';
import { ContainerDetailsPage } from '../features/container-details';

const AppRouter: React.FC = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavigationBar title="Farm OS Dashboard" />
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ContainerManagementDashboard />} />
          <Route path="/containers" element={<ContainerListPage />} />
          <Route path="/containers/:containerId" element={<ContainerDetailsPage />} />
          <Route path="/metrics" element={<ContainerMetricsPage />} />
          <Route path="/example" element={<ExampleFeature />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AppRouter;