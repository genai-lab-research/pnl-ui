import React from 'react';
import { Box, Grid } from '@mui/material';
import { MetricsDashboard } from '../MetricsDashboard';
import { CropsSummaryTable } from '../CropsSummaryTable';
import { ContainerInfoSettings } from '../ContainerInfoSettings';
import { ActivityLog } from '../../../../types/containers';
import { TimePeriod } from '../../types/container-detail';
import { styles } from './OverviewTab.styles';

// Local types to match containerApiService types
interface ContainerInfo {
  id: number;
  name: string;
  type: string;
  tenant: {
    id: number;
    name: string;
  };
  location: Record<string, any>;
  status: string;
}

interface DashboardMetrics {
  air_temperature: number;
  humidity: number;
  co2: number;
  yield: any;
  space_utilization: any;
}

interface CropsSummary {
  seed_type: string;
  nursery_station_count: number;
  cultivation_area_count: number;
  last_seeding_date: string | null;
  last_transplanting_date: string | null;
  last_harvesting_date: string | null;
  average_age: number;
  overdue_count: number;
}

interface OverviewTabProps {
  container: ContainerInfo;
  metrics: DashboardMetrics;
  crops: CropsSummary[];
  activities: ActivityLog[];
  timePeriod: TimePeriod;
  isEditMode: boolean;
  isLoadingActivities: boolean;
  hasMoreActivities: boolean;
  onTimePeriodChange: (period: TimePeriod) => void;
  onEditModeToggle: () => void;
  onSettingsSave: (settings: {
    tenantId: number;
    purpose: string;
    location: Record<string, unknown>;
    notes: string;
    shadowServiceEnabled: boolean;
    roboticsSimulationEnabled: boolean;
    ecosystemConnected: boolean;
  }) => Promise<void>;
  onLoadMoreActivities: () => void;
  onRefreshActivities: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  container,
  metrics,
  crops,
  activities,
  timePeriod,
  isEditMode,
  isLoadingActivities,
  hasMoreActivities,
  onTimePeriodChange,
  onEditModeToggle,
  onSettingsSave,
  onLoadMoreActivities,
  onRefreshActivities
}) => {
  return (
    <Box sx={styles.root}>
      <Grid container spacing={3}>
        {/* Metrics Dashboard Section */}
        <Grid item xs={12}>
          <MetricsDashboard
            metrics={metrics}
            timePeriod={timePeriod}
            onTimePeriodChange={onTimePeriodChange}
          />
        </Grid>

        {/* Crops Summary Section */}
        <Grid item xs={12}>
          <CropsSummaryTable crops={crops} />
        </Grid>

        {/* Container Info & Settings with Activity Feed */}
        <Grid item xs={12}>
          <ContainerInfoSettings
            container={container}
            isEditMode={isEditMode}
            activities={activities}
            isLoadingActivities={isLoadingActivities}
            hasMoreActivities={hasMoreActivities}
            onLoadMoreActivities={onLoadMoreActivities}
            onRefreshActivities={onRefreshActivities}
            onEditModeToggle={onEditModeToggle}
            onSave={onSettingsSave}
          />
        </Grid>
      </Grid>
    </Box>
  );
};