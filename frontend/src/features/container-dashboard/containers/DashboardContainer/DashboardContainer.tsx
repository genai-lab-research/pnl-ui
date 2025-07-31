import React from 'react';
import { Box } from '@mui/material';
import { useDashboard } from '../../hooks/useDashboard';
import { SearchAndFiltersSection } from '../SearchAndFiltersSection';
import { PerformanceOverviewSection } from '../PerformanceOverviewSection';
import { ContainerListSection } from '../ContainerListSection';
import { CreateContainerModal } from '../../components';
import { StyledDashboardContainer } from './DashboardContainer.styles';

export const DashboardContainer: React.FC = () => {
  const dashboard = useDashboard();

  return (
    <StyledDashboardContainer>
      <SearchAndFiltersSection
        filters={dashboard.filters}
        onSearchChange={dashboard.updateSearch}
        onFiltersChange={dashboard.applyFilters}
        onClearFilters={dashboard.clearFilters}
        isSearchLoading={dashboard.isSearchLoading}
        isFilterLoading={dashboard.isFilterLoading}
      />
      
      <Box sx={{ mb: 3 }}>
        <PerformanceOverviewSection
          performance={dashboard.performance}
          summaryStats={dashboard.summaryStats}
          isLoading={dashboard.isTimeRangeLoading}
          onTimeRangeChange={dashboard.changeTimeRange}
          onContainerTypeSelect={dashboard.selectContainerType}
        />
      </Box>
      
      <ContainerListSection
        containers={dashboard.containers}
        pagination={dashboard.pagination}
        isLoading={dashboard.isLoading}
        selectedContainerId={dashboard.selectedContainerId}
        onCreateContainer={dashboard.openCreateModal}
        onDeleteContainer={dashboard.deleteContainer}
        onShutdownContainer={dashboard.shutdownContainer}
        onSelectContainer={dashboard.selectContainer}
        onPageChange={dashboard.changePage}
      />
      
      <CreateContainerModal
        open={dashboard.showCreateModal}
        onClose={dashboard.closeCreateModal}
        onContainerCreated={dashboard.refreshContainers}
      />
    </StyledDashboardContainer>
  );
};