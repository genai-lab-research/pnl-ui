import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { TimeRangeSelector } from '../../../../shared/components/ui/TimeRangeSelector';
import { AirTemperatureCard } from '../AirTemperatureCard';
import { HumidityCard } from '../HumidityCard';
import { CO2LevelCard } from '../CO2LevelCard';
import { YieldCard } from '../YieldCard';
import { SpaceUtilizationCard } from '../SpaceUtilizationCard';
import { DashboardMetrics } from '../../../../api/containerApiService';
import { TimePeriod } from '../../types/container-detail';
import { styles } from './MetricsDashboard.styles';

interface MetricsDashboardProps {
  metrics: DashboardMetrics;
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  timePeriod,
  onTimePeriodChange
}) => {
  // Early return if metrics are not available
  if (!metrics) {
    return (
      <Paper sx={styles.root}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading metrics...</Typography>
        </Box>
      </Paper>
    );
  }
  // Map TimePeriod to TimeRange format
  const mapTimePeriodToTimeRange = (period: TimePeriod): 'Week' | 'Month' | 'Quarter' | 'Year' => {
    return period.charAt(0).toUpperCase() + period.slice(1) as 'Week' | 'Month' | 'Quarter' | 'Year';
  };

  const mapTimeRangeToTimePeriod = (range: 'Week' | 'Month' | 'Quarter' | 'Year'): TimePeriod => {
    return range.toLowerCase() as TimePeriod;
  };

  return (
    <Paper sx={styles.root}>
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.title}>
          Container Metrics
        </Typography>
        <Box sx={styles.timeRangeWrapper}>
          <TimeRangeSelector
            selectedValue={mapTimePeriodToTimeRange(timePeriod)}
            onValueChange={(value) => onTimePeriodChange(mapTimeRangeToTimePeriod(value))}
          />
        </Box>
      </Box>

      <Box sx={styles.metricsContainer}>
        {/* Temperature Metric */}
        <AirTemperatureCard
          currentTemperature={metrics?.air_temperature || 20}
          targetTemperature={21}
        />

        {/* Humidity Metric */}
        <HumidityCard
          currentHumidity={metrics?.humidity || 65}
          targetHumidity={68}
        />

        {/* CO2 Metric */}
        <CO2LevelCard
          currentLevel={metrics?.co2 || 860}
          targetRange="800-900ppm"
        />

        {/* Yield Metric */}
        <YieldCard
          currentYield={metrics?.yield?.total || 51}
          changeValue={1.5}
          transparent
        />

        {/* Nursery Station Utilization */}
        <SpaceUtilizationCard
          title="Nursery Station Utilization"
          currentUtilization={metrics?.space_utilization?.nursery_station || 75}
          changeValue={5}
          spaceType="nursery"
          transparent
        />

        {/* Cultivation Area Utilization */}
        <SpaceUtilizationCard
          title="Cultivation Area Utilization"
          currentUtilization={metrics?.space_utilization?.cultivation_area || 90}
          changeValue={15}
          spaceType="cultivation"
          transparent
        />
      </Box>
    </Paper>
  );
};