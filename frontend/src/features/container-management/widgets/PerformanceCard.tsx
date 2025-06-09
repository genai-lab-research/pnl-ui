import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

import { TimeRangeOption } from '../sections/TimeRangeSelector';
import { MetricChart } from '../../../shared/components/ui/Chart/MetricChart';
import { MetricData } from '../../../shared/types/metrics';

export interface PerformanceCardProps {
  title: string;
  count: number;
  yieldData: MetricData[];             
  utilizationData: MetricData[];       
  averageYield: number;
  totalYield: number;
  averageUtilization: number;
  timeRange: TimeRangeOption;
  className?: string;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  title,
  count,
  yieldData,
  utilizationData,
  averageYield,
  totalYield,
  averageUtilization,
  timeRange,
  className = '',
}) => {
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
        <MetricChart
          title="YIELD"
          data={yieldData}
          avg={averageYield}
          total={totalYield}
          unit="KG"
          barColor="#4CAF50"
          timeRange={timeRange}
        />
        <MetricChart
          title="SPACE UTILIZATION"
          data={utilizationData}
          avg={averageUtilization}
          unit="%"
          barColor="#2196F3"
          timeRange={timeRange}
        />
      </Box>
    </Paper>
  );
};

export default PerformanceCard;
