import React from 'react';
import { Box, Typography, AppBar, Toolbar, Avatar } from '@mui/material';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardContainer } from '../../containers/DashboardContainer';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StyledDashboard } from './ContainerManagementDashboard.styles';

export const ContainerManagementDashboard = () => {
  const dashboard = useDashboard();

  if (!dashboard.isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <StyledDashboard>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Control Panel
            </Typography>
            <Avatar sx={{ width: 32, height: 32 }} />
          </Toolbar>
        </AppBar>
        
        <Box component="main" sx={{ flex: 1, p: 3 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
            Container Managements
          </Typography>
          
          <DashboardContainer />
        </Box>
      </StyledDashboard>
    </ErrorBoundary>
  );
};