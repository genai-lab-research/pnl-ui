import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Box } from '@mui/material';

import { ContainerDetailsPage } from '../features/container-details';
import { ContainerManagementDashboard } from '../features/container-management';
// Pages
import { ContainerListPage } from '../features/containers';
import { ExampleFeature } from '../features/example';
import { ContainerMetricsPage } from '../features/metrics';
// Components
import { NavigationBar } from '../shared/components/layout';

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
