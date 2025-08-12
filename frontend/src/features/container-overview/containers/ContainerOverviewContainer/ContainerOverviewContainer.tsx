import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert, CircularProgress } from '@mui/material';
import { useContainerOverview } from '../../hooks/useContainerOverview';
import { ContainerHeader } from '../../components/ContainerHeader';
import { OverviewTabContent } from '../../components/OverviewTabContent';
import { containerOverviewContainerStyles } from './ContainerOverviewContainer.styles';

interface ContainerOverviewContainerProps {
  containerId: number;
  initialTab?: 'overview' | 'environment' | 'inventory' | 'devices';
}

export const ContainerOverviewContainer: React.FC<ContainerOverviewContainerProps> = ({
  containerId,
  initialTab = 'overview',
}) => {
  const navigate = useNavigate();

  const handleTabChange = useCallback((tab: string) => {
    navigate(`/containers/${containerId}/${tab}`, { replace: true });
  }, [containerId, navigate]);

  const handleError = useCallback((error: string) => {
    console.error('Container overview error:', error);
  }, []);

  const {
    state,
    switchTab,
    refreshData,
    navigateToDashboard,
    clearError,
    breadcrumbs,
    tabs,
    containerDisplayName,
    containerType,
    tenantName,
    locationString,
    statusColor,
    statusLabel,
    containerIconType,
    hasLocationInfo,
    canViewContainer,
    canEditContainer,
    canManageContainer,
    isLoading,
    hasError,
    errorMessage,
  } = useContainerOverview({
    containerId,
    initialTab,
    onTabChange: handleTabChange,
    onError: handleError,
  });

  const handleTabSwitch = useCallback(async (tabKey: string) => {
    await switchTab(tabKey as 'overview' | 'environment' | 'inventory' | 'devices');
  }, [switchTab]);

  const handleBreadcrumbClick = useCallback(() => {
    navigateToDashboard();
  }, [navigateToDashboard]);

  // Show loading state during initial load
  if (isLoading && !state.containerInfo) {
    return (
      <Box sx={containerOverviewContainerStyles.loadingContainer}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  // Show error state
  if (hasError && !state.containerInfo) {
    return (
      <Box sx={containerOverviewContainerStyles.errorContainer}>
        <Alert 
          severity="error" 
          onClose={clearError}
          action={
            <button onClick={() => refreshData()}>
              Retry
            </button>
          }
        >
          {errorMessage || 'Failed to load container data'}
        </Alert>
      </Box>
    );
  }

  // Show access denied if user cannot view container
  if (!canViewContainer && !isLoading) {
    return (
      <Box sx={containerOverviewContainerStyles.errorContainer}>
        <Alert severity="warning">
          You do not have permission to view this container.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={containerOverviewContainerStyles.root}>
      {/* Header Section */}
      <ContainerHeader
        containerName={containerDisplayName}
        containerType={containerType}
        tenantName={tenantName}
        location={hasLocationInfo ? locationString : undefined}
        status={statusLabel}
        statusColor={statusColor}
        containerIconType={containerIconType}
        breadcrumbs={breadcrumbs}
        tabs={tabs}
        activeTab={state.activeTab}
        isLoading={isLoading}
        onBreadcrumbClick={handleBreadcrumbClick}
        onTabChange={handleTabSwitch}
        onRefresh={refreshData}
      />

      {/* Error Banner */}
      {hasError && state.containerInfo && (
        <Box sx={containerOverviewContainerStyles.errorBanner}>
          <Alert 
            severity="error" 
            onClose={clearError}
            sx={{ mb: 2 }}
          >
            {errorMessage}
          </Alert>
        </Box>
      )}

      {/* Tab Content */}
      <Box sx={containerOverviewContainerStyles.content}>
        {state.activeTab === 'overview' && (
          <OverviewTabContent
            containerId={containerId}
            isLoading={isLoading}
            canEdit={canEditContainer}
            canManage={canManageContainer}
            onRefresh={refreshData}
          />
        )}
        
        {state.activeTab === 'environment' && (
          <Box sx={containerOverviewContainerStyles.placeholderTab}>
            Environment & Recipes tab - Coming Soon
          </Box>
        )}
        
        {state.activeTab === 'inventory' && (
          <Box sx={containerOverviewContainerStyles.placeholderTab}>
            Inventory tab - Coming Soon
          </Box>
        )}
        
        {state.activeTab === 'devices' && (
          <Box sx={containerOverviewContainerStyles.placeholderTab}>
            Devices tab - Coming Soon
          </Box>
        )}
      </Box>
    </Box>
  );
};
