import React from 'react';

import { Box, Grid, Typography } from '@mui/material';

import { ContainerMetrics, TimeRangeOption } from '../../services/containerService';
import { StatContainer } from '../../shared/components/ui/Container';
import {
  CO2Icon,
  HumidityIcon,
  TemperatureIcon,
  UtilizationIcon,
  YieldIcon,
} from '../../shared/components/ui/Icon';
import { TimeRangeSelector } from '../container-management/TimeRangeSelector';

export interface MetricsPanelProps {
  metrics: ContainerMetrics;
  timeRange: TimeRangeOption;
  onTimeRangeChange: (range: TimeRangeOption) => void;
  className?: string;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({
  metrics,
  timeRange,
  onTimeRangeChange,
  className,
}) => {
  // Convert API time range format to component format
  const convertTimeRange = (
    apiTimeRange: TimeRangeOption,
  ): 'week' | 'month' | 'quarter' | 'year' => {
    const mapping: Record<TimeRangeOption, 'week' | 'month' | 'quarter' | 'year'> = {
      WEEK: 'week',
      MONTH: 'month',
      QUARTER: 'quarter',
      YEAR: 'year',
    };
    return mapping[apiTimeRange];
  };

  // Convert component time range format to API format
  const convertTimeRangeToApi = (
    componentTimeRange: 'week' | 'month' | 'quarter' | 'year',
  ): TimeRangeOption => {
    const mapping: Record<string, TimeRangeOption> = {
      week: 'WEEK',
      month: 'MONTH',
      quarter: 'QUARTER',
      year: 'YEAR',
    };
    return mapping[componentTimeRange];
  };

  // Format label based on time range
  const formatTimeRangeLabel = (date: string, range: TimeRangeOption): string => {
    switch (range) {
      case 'WEEK':
        return date.substring(0, 3); // Mon, Tue, etc.
      case 'MONTH':
        return date.includes('Day') ? date.substring(4) : new Date(date).getDate().toString();
      case 'QUARTER':
        return date.startsWith('Week') ? date.substring(5) : date.substring(0, 3);
      case 'YEAR':
        return date.length <= 3 ? date : date.substring(0, 3);
      default:
        return date.substring(0, 3);
    }
  };

  // Handle time range change from component
  const handleTimeRangeChange = (range: 'week' | 'month' | 'quarter' | 'year') => {
    onTimeRangeChange(convertTimeRangeToApi(range));
  };

  // Format trend value with + or - sign and percentage
  const formatTrendValue = (value?: number): string => {
    if (value === undefined) return '';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}`;
  };

  return (
    <Box className={className} sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="500">
          Container Metrics
        </Typography>
        <TimeRangeSelector
          selectedRange={convertTimeRange(timeRange)}
          onRangeChange={handleTimeRangeChange}
        />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Air Temperature */}
        <Box sx={{ flex: '1 1 calc(16.666% - 16px)', minWidth: '200px' }}>
          <StatContainer
            title="Air Temperature"
            value={`${metrics.temperature.current.toFixed(2)}°C`}
            comparisonValue={
              metrics.temperature.target ? ` / ${metrics.temperature.target}°C` : undefined
            }
            icon={<TemperatureIcon sx={{ color: 'text.secondary' }} />}
          />
        </Box>

        {/* Relative Humidity */}
        <Box sx={{ flex: '1 1 calc(16.666% - 16px)', minWidth: '200px' }}>
          <StatContainer
            title="Rel. Humidity"
            value={`${metrics.humidity.current.toFixed(2)}%`}
            comparisonValue={metrics.humidity.target ? ` / ${metrics.humidity.target}%` : ` / 68%`}
            icon={<HumidityIcon sx={{ color: 'text.secondary' }} />}
          />
        </Box>

        {/* CO₂ Level */}
        <Box sx={{ flex: '1 1 calc(16.666% - 16px)', minWidth: '200px' }}>
          <StatContainer
            title="CO₂ Level"
            value={`${metrics.co2.current.toFixed(2)}`}
            comparisonValue={
              metrics.co2.target
                ? `/ ${metrics.co2.target}-900${metrics.co2.unit}`
                : `/ 800-900${metrics.co2.unit}`
            }
            icon={<CO2Icon sx={{ color: 'text.secondary' }} />}
          />
        </Box>

        {/* Yield */}
        <Box sx={{ flex: '1 1 calc(16.666% - 16px)', minWidth: '200px' }}>
          <StatContainer
            title="Yield"
            value={`${metrics.yield.current.toFixed(2)}${metrics.yield.unit}`}
            trendValue={
              metrics.yield.trend ? `+${metrics.yield.trend}${metrics.yield.unit}` : '+1.5Kg'
            }
            icon={<YieldIcon sx={{ color: 'text.secondary' }} />}
          />
        </Box>

        {/* Nursery Station Utilization */}
        <Box sx={{ flex: '1 1 calc(16.666% - 16px)', minWidth: '200px' }}>
          <StatContainer
            title="Nursery Station Utilization"
            value={`${metrics.nursery_utilization.current.toFixed(2)}%`}
            trendValue={
              metrics.nursery_utilization.trend ? `+${metrics.nursery_utilization.trend}%` : '+5%'
            }
            icon={<UtilizationIcon sx={{ color: 'text.secondary' }} />}
          />
        </Box>

        {/* Cultivation Area Utilization */}
        <Box sx={{ flex: '1 1 calc(16.666% - 16px)', minWidth: '200px' }}>
          <StatContainer
            title="Cultivation Area Utilization"
            value={`${metrics.cultivation_utilization.current.toFixed(2)}%`}
            trendValue={
              metrics.cultivation_utilization.trend
                ? `+${metrics.cultivation_utilization.trend}%`
                : '+15%'
            }
            icon={<UtilizationIcon sx={{ color: 'text.secondary' }} />}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MetricsPanel;
