import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { BarChartBarMedium } from '../Chart';
import { metricsApi, MetricDataPoint } from '../../../utils/api';
import { MetricTimeRange, StatData } from '../../../types/metrics';

// Helper function to transform API data to chart format
const transformMetricDataToChartData = (data: MetricDataPoint[], timeRange: MetricTimeRange): StatData[] => {
  return data.map(item => {
    let day;
    
    // Format based on time range
    switch (timeRange) {
      case MetricTimeRange.WEEK:
        // For weekly data, use 3-letter day abbreviation
        day = new Date(item.date).toLocaleString('en-US', { weekday: 'short' }).substring(0, 3);
        break;
      case MetricTimeRange.MONTH:
        // For monthly data, use day of month
        day = new Date(item.date).getDate().toString();
        break;
      case MetricTimeRange.QUARTER:
        // For quarterly data, use week abbreviation
        if (item.date.startsWith('Week')) {
          day = item.date.substring(0, 3); // "Wee" abbreviation
        } else {
          day = `W${new Date(item.date).getMonth() * 4 + Math.floor(new Date(item.date).getDate() / 7) + 1}`;
        }
        break;
      case MetricTimeRange.YEAR:
        // For yearly data, use 3-letter month abbreviation
        if (item.date.length <= 3) {
          day = item.date; // Already abbreviated
        } else {
          day = new Date(item.date).toLocaleString('en-US', { month: 'short' }).substring(0, 3);
        }
        break;
      default:
        day = item.date;
    }
      
    return {
      day,
      value: item.value
    };
  });
};


export interface StatContainerProps {
  /**
   * Stat container title
   */
  title: string;
  
  /**
   * Main stat value/count to display
   */
  value: string | number;
  
  /**
   * Icon to display with the metric
   */
  icon?: React.ReactNode;
  
  /**
   * Comparison value (e.g. target or threshold)
   */
  comparisonValue?: string;
  
  /**
   * Trend value to display (with + or - indicator)
   */
  trendValue?: string;
  
  /**
   * Left chart title
   */
  leftChartTitle?: string;
  
  /**
   * Right chart title
   */
  rightChartTitle?: string;
  
  /**
   * Average value for left chart (optional)
   */
  leftAverage?: string | number;
  
  /**
   * Total value for left chart (optional)
   */
  leftTotal?: string | number;
  
  /**
   * Average value for right chart (optional)
   */
  rightAverage?: string | number;
  
  /**
   * Left chart data
   */
  leftChartData?: StatData[];
  
  /**
   * Right chart data
   */
  rightChartData?: StatData[];
  
  /**
   * Custom class name
   */
  className?: string;

  /**
   * Whether to fetch data from API
   */
  useApi?: boolean;

  /**
   * Container ID to fetch metrics for
   */
  containerId?: string;

  /**
   * Time range for metrics data
   */
  timeRange?: MetricTimeRange;
}

/**
 * StatContainer component for displaying statistics with charts
 */
export const StatContainer: React.FC<StatContainerProps> = ({
  title,
  value: initialValue,
  icon,
  comparisonValue,
  trendValue,
  leftChartTitle,
  rightChartTitle,
  leftAverage: initialLeftAverage,
  leftTotal: initialLeftTotal,
  rightAverage: initialRightAverage,
  leftChartData: initialLeftChartData = [],
  rightChartData: initialRightChartData = [],
  className,
  useApi = false,
  containerId,
  timeRange = MetricTimeRange.WEEK,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string | number>(initialValue);
  const [leftChartData, setLeftChartData] = useState<StatData[]>(initialLeftChartData);
  const [rightChartData, setRightChartData] = useState<StatData[]>(initialRightChartData);
  const [leftAverage, setLeftAverage] = useState<string | number | undefined>(initialLeftAverage);
  const [leftTotal, setLeftTotal] = useState<string | number | undefined>(initialLeftTotal);
  const [rightAverage, setRightAverage] = useState<string | number | undefined>(initialRightAverage);
  
  useEffect(() => {
    if (!useApi || !containerId) return;
    
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await metricsApi.getContainerMetrics(containerId, timeRange);
        
        // Update state with fetched data
        setValue(response.total_yield.toFixed(2) + ' kg');
        setLeftAverage(response.average_yield.toFixed(2) + ' kg');
        setLeftTotal(response.total_yield.toFixed(2) + ' kg');
        setRightAverage(response.average_space_utilization.toFixed(2) + '%');
        
        // Transform API data to chart format
        setLeftChartData(transformMetricDataToChartData(response.yield_data, timeRange));
        setRightChartData(transformMetricDataToChartData(response.space_utilization_data, timeRange));
        
      } catch (err) {
        console.error('Failed to fetch metrics:', err);
        setError('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, [useApi, containerId, timeRange]);
  
  return (
    <Card 
      className={className}
      elevation={0}
      sx={{
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'visible',
        height: '100%',
        backgroundColor: '#fafafa',
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <CardContent sx={{ p: 1.5 }}>
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              mb: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              {icon && (
                <Box sx={{ display: 'flex', alignItems: 'center', height: 20 }}>
                  {icon}
                </Box>
              )}
              <Typography 
                variant="subtitle2" 
                fontWeight="normal" 
                color="text.secondary"
                sx={{ fontSize: '0.875rem' }}
              >
                {title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography 
                variant="h4" 
                fontWeight="500"
                sx={{ lineHeight: 1.1 }}
              >
                {value}
              </Typography>
              {comparisonValue && (
                <Typography 
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 0.5 }}
                >
                  {comparisonValue}
                </Typography>
              )}
              {trendValue && (
                <Typography 
                  variant="body2"
                  sx={{ 
                    ml: 1, 
                    color: trendValue.startsWith('+') ? 'success.main' : 'error.main',
                    fontWeight: 500
                  }}
                >
                  {trendValue}
                </Typography>
              )}
            </Box>
          </Box>
          
          {(leftChartData.length > 0 || rightChartData.length > 0 || leftChartTitle) && (
          <Grid container spacing={2}>
            {leftChartData.length > 0 && (
              <Grid item xs={6}>
                <Box>
                  {leftChartTitle && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                        {leftChartTitle}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {leftAverage && (
                          <Typography variant="caption" color="text.secondary">
                            AVG: {leftAverage}
                          </Typography>
                        )}
                        {leftTotal && (
                          <Typography variant="caption" color="text.secondary">
                            TOTAL: {leftTotal}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                  <Box sx={{ height: 70 }}>
                    <BarChartBarMedium 
                      data={leftChartData}
                      barColor="#4CAF50"
                      maxValue={Math.max(...leftChartData.map(item => item.value)) * 1.2}
                    />
                  </Box>
                </Box>
              </Grid>
            )}
            
            {rightChartData.length > 0 && (
              <Grid item xs={6}>
                <Box>
                  {rightChartTitle && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                        {rightChartTitle}
                      </Typography>
                      {rightAverage && (
                        <Typography variant="caption" color="text.secondary">
                          AVG: {rightAverage}
                        </Typography>
                      )}
                    </Box>
                  )}
                  <Box sx={{ height: 70 }}>
                    <BarChartBarMedium 
                      data={rightChartData}
                      barColor="#2196F3"
                      maxValue={Math.max(...rightChartData.map(item => item.value)) * 1.2}
                    />
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
        </CardContent>
      )}
    </Card>
  );
};

export default StatContainer;