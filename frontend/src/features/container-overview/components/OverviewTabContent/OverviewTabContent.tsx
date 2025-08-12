import React from 'react';
import { Box, Grid } from '@mui/material';
import { DashboardMetricsSection } from '../DashboardMetricsSection';
import { CropsSummarySection } from '../CropsSummarySection';
import { ContainerInfoSection } from '../ContainerInfoSection';
import { overviewTabContentStyles } from './OverviewTabContent.styles';

interface OverviewTabContentProps {
  containerId: number;
  isLoading?: boolean;
  canEdit?: boolean;
  canManage?: boolean;
  onRefresh: () => void;
}

export const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  containerId,
  isLoading = false,
  canEdit = false,
  canManage = false,
  onRefresh,
}) => {
  return (
    <Box sx={overviewTabContentStyles.root}>
      <Grid container spacing={3}>
        {/* Dashboard Metrics Section - Full Width */}
        <Grid item xs={12}>
          <DashboardMetricsSection
            containerId={containerId}
            isLoading={isLoading}
            onRefresh={onRefresh}
          />
        </Grid>

        {/* Crops Summary Section - Full Width */}
        <Grid item xs={12}>
          <CropsSummarySection
            containerId={containerId}
            isLoading={isLoading}
            onRefresh={onRefresh}
          />
        </Grid>

        {/* Container Information & Settings - Full Width */}
        <Grid item xs={12}>
          <ContainerInfoSection
            containerId={containerId}
            canEdit={canEdit}
            canManage={canManage}
            isLoading={isLoading}
            onRefresh={onRefresh}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
