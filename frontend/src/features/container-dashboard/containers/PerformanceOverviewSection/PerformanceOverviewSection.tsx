import React from 'react';
import { Box, Grid, CircularProgress } from '@mui/material';
import { TimeRangeSelector } from '../../../../shared/components/ui/TimeRangeSelector';
import { MetricCard } from '../../../../shared/components/ui/MetricCard';
import { PerformanceMetricsDomainModel, TimeRangeType } from '../../models';
import { formatChartData } from '../../../../shared/utils/dateFormatter';
import { StyledPerformanceOverviewSection } from './PerformanceOverviewSection.styles';

interface PerformanceOverviewSectionProps {
  performance: PerformanceMetricsDomainModel | null;
  summaryStats: any;
  isLoading: boolean;
  onTimeRangeChange: (range: TimeRangeType) => Promise<void>;
  onContainerTypeSelect: (type: 'all' | 'physical' | 'virtual') => Promise<void>;
}

export const PerformanceOverviewSection: React.FC<PerformanceOverviewSectionProps> = ({
  performance,
  summaryStats,
  isLoading,
  onTimeRangeChange,
  onContainerTypeSelect,
}) => {
  if (isLoading && !performance) {
    return (
      <StyledPerformanceOverviewSection>
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </StyledPerformanceOverviewSection>
    );
  }

  const handleTimeRangeChange = (range: 'Week' | 'Month' | 'Quarter' | 'Year') => {
    const mappedRange = range.toLowerCase() as TimeRangeType;
    onTimeRangeChange(mappedRange);
  };

  const currentTimeRange = performance?.timeRange?.type || 'week';
  const selectedValue = (currentTimeRange.charAt(0).toUpperCase() + currentTimeRange.slice(1)) as 'Week' | 'Month' | 'Quarter' | 'Year';

  return (
    <StyledPerformanceOverviewSection>
      <Box sx={{ mb: 2 }}>
        <TimeRangeSelector
          selectedValue={selectedValue}
          onValueChange={handleTimeRangeChange}
          options={[
            { value: 'Week', label: 'Week' },
            { value: 'Month', label: 'Month' },
            { value: 'Quarter', label: 'Quarter' },
            { value: 'Year', label: 'Year' },
          ]}
          isLoading={isLoading}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MetricCard
            title="Physical Containers"
            containerCount={performance?.physical?.containerCount || 0}
            yieldData={{
              average: performance?.physical?.yield?.average || 0,
              total: performance?.physical?.yield?.total || 0,
              unit: 'KG',
              chartData: formatChartData(performance?.physical?.yield?.chartData || [], currentTimeRange),
            }}
            spaceUtilizationData={{
              average: performance?.physical?.spaceUtilization?.average || 0,
              unit: '%',
              chartData: formatChartData(performance?.physical?.spaceUtilization?.chartData || [], currentTimeRange),
            }}
            isLoading={isLoading}
            onClick={() => onContainerTypeSelect('physical')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <MetricCard
            title="Virtual Containers"
            containerCount={performance?.virtual?.containerCount || 0}
            yieldData={{
              average: performance?.virtual?.yield?.average || 0,
              total: performance?.virtual?.yield?.total || 0,
              unit: 'KG',
              chartData: formatChartData(performance?.virtual?.yield?.chartData || [], currentTimeRange),
            }}
            spaceUtilizationData={{
              average: performance?.virtual?.spaceUtilization?.average || 0,
              unit: '%',
              chartData: formatChartData(performance?.virtual?.spaceUtilization?.chartData || [], currentTimeRange),
            }}
            isLoading={isLoading}
            onClick={() => onContainerTypeSelect('virtual')}
          />
        </Grid>
      </Grid>
    </StyledPerformanceOverviewSection>
  );
};