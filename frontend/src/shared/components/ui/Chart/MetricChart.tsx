import React from 'react';
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
import { Typography, Box } from '@mui/material';
import { getPeakDay } from '../../../utils/metrics';
import { TimeRangeOption } from '../../../../features/container-management/sections/TimeRangeSelector';

export interface MetricData {
  day: string;
  value: number;
}

interface MetricChartProps {
  title: string;
  data: MetricData[];
  avg: number;
  total?: number;
  unit: string;
  barColor: string;
  timeRange: TimeRangeOption;
}

export const MetricChart: React.FC<MetricChartProps> = ({
  title,
  data,
  avg,
  total,
  unit,
  barColor,
  timeRange,
}) => {
  return (
    <Box sx={{ flex: 1, mx: 2 }}>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem', mb: 1 }}>
        {title.toUpperCase()}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 0.5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mr: 1, fontSize: '0.75rem', fontWeight: 400 }}
        >
          AVG
        </Typography>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem', mr: 3 }}>
          {avg.toFixed(2)}
          {unit}
        </Typography>
        {total !== undefined && (
          <>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mr: 1, fontSize: '0.75rem', fontWeight: 400 }}
            >
              TOTAL
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
              {total.toFixed(2)}
              {unit}
            </Typography>
          </>
        )}
      </Box>
      <Box sx={{ height: 200, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={16} margin={{ top: 15, right: 5, left: 5, bottom: 25 }}>
            <CartesianGrid horizontal vertical={false} stroke="#E0E0E0" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#757575' }}
              height={50}
              tickMargin={10}
              interval={
                timeRange === 'year'
                  ? 1
                  : timeRange === 'month' && data.length > 12
                  ? 2
                  : 0
              }
            />
            <YAxis hide />
            <Tooltip
              formatter={(value) => [`${value}${unit}`, title]}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Bar dataKey="value" fill={barColor} radius={[3, 3, 0, 0]} />
            <ReferenceLine
              x={getPeakDay(data)}
              strokeWidth={0}
              isFront
              label={{
                value: '▼',
                position: 'top',
                fill: '#000',
                fontSize: 12,
                offset: 8,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
