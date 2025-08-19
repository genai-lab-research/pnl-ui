import React, { useCallback, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { MetricCard } from '../../../shared/components/ui/MetricCard';
import { TimeRangeSelector } from '../../../shared/components/ui/TimeRangeSelector';
import { TimeRange, TimeRangeOption } from '../../../shared/components/ui/TimeRangeSelector/types';
import { useContainerMetrics } from '../hooks/useContainerMetrics';
import { ContainerMetricsOverviewViewModel } from '../viewmodels/ContainerMetricsOverviewViewModel';
import { StyledContainerMetricsOverview } from './ContainerMetricsOverview.style';
import { useContainerFilters } from '../hooks/useContainerFilters';

interface ContainerMetricsOverviewProps {
  className?: string;
  containerFilters?: ReturnType<typeof useContainerFilters>;
}



export const ContainerMetricsOverview: React.FC<ContainerMetricsOverviewProps> = ({ 
  className, 
  containerFilters 
}) => {
  const viewModel = new ContainerMetricsOverviewViewModel();
  
  const {
    metrics,
    isLoading,
    isError,
    error,
    timeRange,
    setTimeRange,
    refreshMetrics
  } = useContainerMetrics();

  const timeRangeOptions: TimeRangeOption[] = [
    { value: 'Week', label: 'Week' },
    { value: 'Month', label: 'Month' },
    { value: 'Quarter', label: 'Quarter' },
    { value: 'Year', label: 'Year' }
  ];

  const handleTimeRangeChange = useCallback((value: TimeRange) => {
    setTimeRange(value.toLowerCase() as any);
  }, [setTimeRange]);

  const handlePhysicalCardClick = useCallback(() => {
    console.log('Physical card clicked - applying filter');
    // Apply physical container filter directly
    if (containerFilters) {
      containerFilters.setTypeFilter('physical');
    }
  }, [containerFilters]);

  const handleVirtualCardClick = useCallback(() => {
    console.log('Virtual card clicked - applying filter');
    // Apply virtual container filter directly
    if (containerFilters) {
      containerFilters.setTypeFilter('virtual');
    }
  }, [containerFilters]);

  // Helper function to transform API data to component format
  const transformChartData = useCallback((chartData: any[]) => {
    return chartData.map((point) => {
      const date = new Date(point.date);
      let label = '';

      switch (timeRange) {
        case 'week':
          // Show day names (Sun, Mon, Tue, etc.)
          label = date.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'month':
          // Show day numbers (1, 2, 3, ..., 30/31)
          label = date.getDate().toString();
          break;
        case 'quarter':
        case 'year':
          // Show month names (Jan, Feb, Mar, etc.)
          label = date.toLocaleDateString('en-US', { month: 'short' });
          break;
        default:
          label = date.toLocaleDateString('en-US', { weekday: 'short' });
      }

      return {
        day: label,
        value: point.value,
        isCurrent: point.is_current_period
      };
    });
  }, [timeRange]);

  if (isError) {
    return (
      <Box className="error-state">
        <Typography color="error" variant="body1">
          Error loading metrics: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <StyledContainerMetricsOverview className={className}>
      <Box className="time-range-selector">
        <TimeRangeSelector
          selectedValue={(timeRange?.charAt(0).toUpperCase() + timeRange?.slice(1)) as TimeRange}
          onValueChange={handleTimeRangeChange}
          options={timeRangeOptions}
          disabled={isLoading}
          aria-label="Select time range for metrics"
        />
      </Box>

      <Grid container spacing={3} className="metrics-grid">
        <Grid item xs={12} md={6}>
          <MetricCard
            title="Physical Containers"
            containerCount={metrics?.physical?.container_count || 0}
            yieldData={{
              average: metrics?.physical?.yield?.average || 0,
              total: metrics?.physical?.yield?.total,
              unit: 'kg',
              chartData: metrics ? transformChartData(metrics.physical.yield.chart_data) : []
            }}
            spaceUtilizationData={{
              average: metrics?.physical?.space_utilization?.average || 0,
              unit: '%',
              chartData: metrics ? transformChartData(metrics.physical.space_utilization.chart_data) : []
            }}
            isLoading={isLoading}
            onClick={handlePhysicalCardClick}
            className="metric-card"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MetricCard
            title="Virtual Containers"
            containerCount={metrics?.virtual?.container_count || 0}
            yieldData={{
              average: metrics?.virtual?.yield?.average || 0,
              total: metrics?.virtual?.yield?.total,
              unit: 'kg',
              chartData: metrics ? transformChartData(metrics.virtual.yield.chart_data) : []
            }}
            spaceUtilizationData={{
              average: metrics?.virtual?.space_utilization?.average || 0,
              unit: '%',
              chartData: metrics ? transformChartData(metrics.virtual.space_utilization.chart_data) : []
            }}
            isLoading={isLoading}
            onClick={handleVirtualCardClick}
            className="metric-card"
          />
        </Grid>
      </Grid>
    </StyledContainerMetricsOverview>
  );
};

export default ContainerMetricsOverview;