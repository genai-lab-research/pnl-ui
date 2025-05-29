import React from 'react';

import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { TimeRangeOption } from '../sections/TimeRangeSelector';

interface MetricData {
  day: string;
  value: number;
}

export interface PerformanceCardProps {
  /**
   * Container type title ("Physical Containers" or "Virtual Containers")
   */
  title: string;

  /**
   * Container count to display in badge
   */
  count: number;

  /**
   * Yield data for bar chart
   */
  yieldData: MetricData[];

  /**
   * Space utilization data for bar chart
   */
  utilizationData: MetricData[];

  /**
   * Average yield
   */
  averageYield: number;

  /**
   * Total yield
   */
  totalYield: number;

  /**
   * Average utilization percentage
   */
  averageUtilization: number;

  /**
   * Currently selected time range
   */
  timeRange: TimeRangeOption;

  /**
   * Optional custom class name
   */
  className?: string;
}

/**
 * PerformanceCard component for displaying container performance metrics
 */
export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  title,
  count,
  yieldData,
  utilizationData,
  averageYield,
  totalYield,
  averageUtilization,
  timeRange,
  className,
}) => {
  // Determine badge color and size based on container type
  const badgeColor = title === 'Physical Containers' ? '#3F51B5' : '#673AB7';

  return (
    <Paper
      className={className}
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3.5,
          mt: 0.5,
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1.25rem', ml: 0.5 }}>
          {title}
        </Typography>
        <Box
          sx={{
            bgcolor: '#F7F7F7',
            color: 'black',
            borderRadius: 10,
            px: 1.5,
            py: 0.5,
            fontSize: '1.25rem',
            fontWeight: 600,
            minWidth: '36px',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {count}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', mt: 2 }}>
        {/* Yield Section */}
        <Box sx={{ flex: 1, mr: 2 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem', mb: 1 }}>
              YIELD
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 0.5 }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mr: 1, fontSize: '0.75rem', fontWeight: 400 }}
              >
                AVG
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem', mr: 3 }}>
                {averageYield.toFixed(2)}KG
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mr: 1, fontSize: '0.75rem', fontWeight: 400 }}
              >
                TOTAL
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                {totalYield.toFixed(2)}KG
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: 200, width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yieldData}
                margin={{
                  top: 15,
                  right: 5,
                  left: 5,
                  bottom: 25,
                }}
                barSize={16}
              >
                <CartesianGrid
                  horizontal={true}
                  vertical={false}
                  stroke="#E0E0E0"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#757575' }}
                  height={50}
                  tickMargin={10}
                  // Use dynamic interval based on timeRange and data length
                  interval={
                    timeRange === 'year'
                      ? 1
                      : timeRange === 'month' && yieldData.length > 12
                      ? 2
                      : 0
                  }
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${value} KG`, 'Yield']}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar dataKey="value" fill="#4CAF50" radius={[3, 3, 0, 0]} />
                {/* Add peak indicator for highest value */}
                {yieldData.length > 0 && (
                  <ReferenceLine
                    x={
                      yieldData.reduce(
                        (maxObj, current) => (current.value > maxObj.value ? current : maxObj),
                        yieldData[0],
                      ).day
                    }
                    stroke="#000"
                    strokeDasharray="0"
                    isFront={true}
                    strokeWidth={0}
                    label={{
                      value: '▼',
                      position: 'top',
                      fill: '#000',
                      fontSize: 12,
                      offset: 8,
                    }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Space Utilization Section */}
        <Box sx={{ flex: 1, ml: 2 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem', mb: 1 }}>
              SPACE UTILIZATION
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 0.5 }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mr: 1, fontSize: '0.75rem', fontWeight: 400 }}
              >
                AVG
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                {averageUtilization.toFixed(2)}%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: 200, width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={utilizationData}
                margin={{
                  top: 15,
                  right: 5,
                  left: 5,
                  bottom: 25,
                }}
                barSize={16}
              >
                <CartesianGrid
                  horizontal={true}
                  vertical={false}
                  stroke="#E0E0E0"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#757575' }}
                  height={50}
                  tickMargin={10}
                  // Use dynamic interval based on timeRange and data length
                  interval={
                    timeRange === 'year'
                      ? 1
                      : timeRange === 'month' && yieldData.length > 12
                      ? 2
                      : 0
                  }
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Utilization']}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar dataKey="value" fill="#2196F3" radius={[3, 3, 0, 0]} />
                {/* Add peak indicator for highest value */}
                {utilizationData.length > 0 && (
                  <ReferenceLine
                    x={
                      utilizationData.reduce(
                        (maxObj, current) => (current.value > maxObj.value ? current : maxObj),
                        utilizationData[0],
                      ).day
                    }
                    stroke="#000"
                    strokeDasharray="0"
                    isFront={true}
                    strokeWidth={0}
                    label={{
                      value: '▼',
                      position: 'top',
                      fill: '#000',
                      fontSize: 12,
                      offset: 8,
                    }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default PerformanceCard;
