import React, { useState, useEffect, useCallback } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ContainerHeader } from '../../components/ContainerHeader';
import { OverviewTab } from '../../components/OverviewTab';
import { useContainerData } from '../../hooks/useContainerData';
import { useMetricsPolling } from '../../hooks/useMetricsPolling';
import { useActivityScroll } from '../../hooks/useActivityScroll';
import { ContainerDetailTab, TimePeriod } from '../../types/container-detail';
import { styles } from './ContainerDetailContainer.styles';

interface ContainerDetailContainerProps {
  containerId: number;
  initialTab: ContainerDetailTab['id'];
}

export const ContainerDetailContainer: React.FC<ContainerDetailContainerProps> = ({
  containerId,
  initialTab
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContainerDetailTab['id']>(initialTab);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [isEditMode, setIsEditMode] = useState(false);

  // Custom hooks for data management
  const {
    containerData,
    isLoading: isContainerLoading,
    error: containerError,
    refreshData: refreshContainer
  } = useContainerData(containerId, timePeriod);

  const {
    metrics,
    isPolling,
    startPolling,
    stopPolling
  } = useMetricsPolling(containerId, timePeriod);

  const {
    activities,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh: refreshActivities
  } = useActivityScroll(containerId);

  // Handle tab changes
  const handleTabChange = useCallback((tab: ContainerDetailTab['id']) => {
    setActiveTab(tab);
    navigate(`/containers/${containerId}/${tab}`, { replace: true });
  }, [containerId, navigate]);

  // Handle time period changes
  const handleTimePeriodChange = useCallback((period: TimePeriod) => {
    setTimePeriod(period);
  }, []);

  // Handle settings save
  const handleSettingsSave = useCallback(async (settings: {
    tenantId: number;
    purpose: string;
    location: Record<string, unknown>;
    notes: string;
    shadowServiceEnabled: boolean;
    roboticsSimulationEnabled: boolean;
    ecosystemConnected: boolean;
  }) => {
    try {
      // Settings update logic will be implemented
      setIsEditMode(false);
      await refreshContainer();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [refreshContainer]);

  // Start metrics polling on mount
  useEffect(() => {
    if (activeTab === 'overview') {
      startPolling();
      return () => stopPolling();
    }
  }, [activeTab, startPolling, stopPolling]);

  // Loading state
  if (isContainerLoading && !containerData) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  // Error state
  if (containerError) {
    return (
      <Box sx={styles.errorContainer}>
        <Alert severity="error">
          {containerError}
        </Alert>
      </Box>
    );
  }

  // No data state
  if (!containerData) {
    return (
      <Box sx={styles.errorContainer}>
        <Alert severity="warning">
          Container not found
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={styles.root}>
      <ContainerHeader
        container={containerData.container}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <Box sx={styles.content}>
        {activeTab === 'overview' && (
          <OverviewTab
            container={containerData.container}
            metrics={metrics || containerData.dashboardMetrics}
            crops={containerData.cropsSummary}
            activities={activities}
            timePeriod={timePeriod}
            isEditMode={isEditMode}
            isLoadingActivities={isLoadingMore}
            hasMoreActivities={hasMore}
            onTimePeriodChange={handleTimePeriodChange}
            onEditModeToggle={() => setIsEditMode(!isEditMode)}
            onSettingsSave={handleSettingsSave}
            onLoadMoreActivities={loadMore}
            onRefreshActivities={refreshActivities}
          />
        )}
        
        {activeTab === 'environment' && (
          <Box sx={styles.tabContent}>
            Environment & Recipes tab content coming soon
          </Box>
        )}
        
        {activeTab === 'inventory' && (
          <Box sx={styles.tabContent}>
            Inventory tab content coming soon
          </Box>
        )}
        
        {activeTab === 'devices' && (
          <Box sx={styles.tabContent}>
            Devices tab content coming soon
          </Box>
        )}
      </Box>
    </Box>
  );
};