import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { MetricCard } from '../MetricCard';
import { ContainerTimePeriodTabs } from './components/ContainerTimePeriodTabs';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import { dashboardMetricsSectionStyles } from './DashboardMetricsSection.styles';

interface DashboardMetricsSectionProps {
  containerId: number;
  isLoading?: boolean;
  onRefresh: () => void;
}

export const DashboardMetricsSection: React.FC<DashboardMetricsSectionProps> = ({
  containerId,
  isLoading = false,
  onRefresh,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    state,
    // Access metrics from state for now
    // metrics,
    // timeRange,
    // isMetricsLoading,
    hasError,
    errorMessage,
    // setTimeRange,
    // refreshData: refreshMetrics,
  } = useDashboardMetrics({
    containerId,
  });

  // Extract metrics from state (placeholder structure)
  const metrics = state?.metrics || null;
  const timeRange = state?.timeRange || 'week';
  const isMetricsLoading = state?.isLoading || false;

  const handleTimeRangeChange = (newTimeRange: string) => {
    // For now, just refresh with new time range
    // setTimeRange(newTimeRange as 'week' | 'month' | 'quarter' | 'year');
    console.log('Time range changed to:', newTimeRange);
  };

  const handleRefresh = () => {
    // refreshMetrics();
    onRefresh();
  };

  if (isLoading || (isMetricsLoading && !metrics)) {
    return (
      <Card sx={dashboardMetricsSectionStyles.card}>
        <CardContent sx={dashboardMetricsSectionStyles.cardContent}>
          <Box sx={dashboardMetricsSectionStyles.header}>
            <Skeleton variant="text" width={200} height={28} />
            <Skeleton variant="rectangular" width={280} height={32} />
          </Box>
          
          <Grid container spacing={2} sx={dashboardMetricsSectionStyles.metricsGrid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                <Skeleton variant="rectangular" height={100} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card sx={dashboardMetricsSectionStyles.card}>
        <CardContent sx={dashboardMetricsSectionStyles.cardContent}>
          <Box sx={dashboardMetricsSectionStyles.errorState}>
            <Typography color="error" variant="body1">
              {errorMessage || 'Failed to load metrics'}
            </Typography>
            <button onClick={handleRefresh}>
              Try Again
            </button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={dashboardMetricsSectionStyles.card}>
      <CardContent sx={dashboardMetricsSectionStyles.cardContent}>
        <Box sx={dashboardMetricsSectionStyles.header}>
          <Typography variant="h6" sx={dashboardMetricsSectionStyles.title}>
            Container Metrics
          </Typography>
          
          <ContainerTimePeriodTabs
            selectedTimeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
            isLoading={isMetricsLoading}
          />
        </Box>

        <Grid container spacing={2} sx={dashboardMetricsSectionStyles.metricsGrid}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard
              title="Air Temperature"
              value={metrics?.air_temperature?.value ?? 20}
              unit="°C"
              change="+1.5°C"
              trend="up"
              isLoading={isMetricsLoading}
              variant="temperature"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard
              title="Rel. Humidity"
              value={metrics?.humidity?.value ?? 65}
              unit="%"
              change="+5%"
              trend="up"
              isLoading={isMetricsLoading}
              variant="humidity"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard
              title="CO₂ Level"
              value={metrics?.co2?.value ?? 860}
              unit="ppm"
              change="+15ppm"
              trend="up"
              isLoading={isMetricsLoading}
              variant="co2"
            />
          </Grid>

          {/* Vertical Divider - Only on larger screens */}
          {!isMobile && (
            <Grid item lg={0.1} sx={dashboardMetricsSectionStyles.divider}>
              <Box sx={dashboardMetricsSectionStyles.verticalLine} />
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard
              title="Yield"
              value={metrics?.yield?.average ?? 51}
              unit="KG"
              change="+1.5kg"
              trend="up"
              isLoading={isMetricsLoading}
              variant="yield"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard
              title="Nursery Station Utilization"
              value={metrics?.space_utilization?.nursery_station ?? 75}
              unit="%"
              change="+5%"
              trend="up"
              isLoading={isMetricsLoading}
              variant="space"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <MetricCard
              title="Cultivation Area Utilization"
              value={metrics?.space_utilization?.cultivation_area ?? 90}
              unit="%"
              change="+15%"
              trend="up"
              isLoading={isMetricsLoading}
              variant="space"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
