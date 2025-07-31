import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Grid,
  Skeleton,
  useTheme
} from '@mui/material';
import { ChartJSBarChart } from '../ChartJS';

interface ChartDataPoint {
  day: string;
  value: number;
  isCurrent?: boolean;
}

interface MetricData {
  average: number;
  total?: number;
  unit: string;
  chartData: ChartDataPoint[];
}

interface MetricCardProps {
  title: 'Physical Containers' | 'Virtual Containers';
  containerCount: number;
  yieldData: MetricData;
  spaceUtilizationData: MetricData;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  containerCount,
  yieldData,
  spaceUtilizationData,
  isLoading = false,
  onClick,
  className,
}): JSX.Element => {
  const theme = useTheme();
  const isVirtual = title === 'Virtual Containers';
  const chipColor = isVirtual ? '#E3F2FD' : '#E8F5E8';
  const chipTextColor = isVirtual ? '#1976D2' : '#2E7D32';
  const yieldColor = isVirtual ? '#4CAF50' : '#55C569';
  const spaceColor = isVirtual ? '#2196F3' : '#6DB3ED';

  if (isLoading) {
    return (
      <Card 
        className={className}
        sx={{ 
          height: '100%', 
          minHeight: 300, 
          cursor: onClick ? 'pointer' : 'default' 
        }}
      >
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="circular" width={24} height={24} sx={{ mt: 1, mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rectangular" height={80} sx={{ mt: 1 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rectangular" height={80} sx={{ mt: 1 }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={className}
      sx={{ 
        height: '100%', 
        minHeight: 300, 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          boxShadow: theme.shadows[4],
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Chip 
            label={containerCount} 
            size="small" 
            sx={{ 
              backgroundColor: chipColor,
              color: chipTextColor,
              fontWeight: 600,
            }}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                YIELD
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  AVG
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {yieldData.average.toFixed(2)}{yieldData.unit}
                </Typography>
                {yieldData.total !== undefined && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      TOTAL
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {yieldData.total.toFixed(2)}{yieldData.unit}
                    </Typography>
                  </>
                )}
              </Box>
              <Box sx={{ flexGrow: 1, minHeight: 120 }}>
                <ChartJSBarChart
                  data={yieldData.chartData}
                  color={yieldColor}
                  maxHeight={120}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                SPACE UTILIZATION
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  AVG
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {spaceUtilizationData.average.toFixed(2)}{spaceUtilizationData.unit}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, minHeight: 120 }}>
                <ChartJSBarChart
                  data={spaceUtilizationData.chartData}
                  color={spaceColor}
                  maxHeight={120}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};