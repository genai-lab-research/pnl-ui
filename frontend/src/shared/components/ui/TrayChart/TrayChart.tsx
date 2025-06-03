import React, { useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface TrayChartProps {
  /**
   * The title of the chart
   */
  title: string;
  /**
   * Optional subtitle or description of the data
   */
  subtitle?: string;
  /**
   * The data points for the chart [x, y]
   */
  data: Array<[number, number]>;
  /**
   * Start value for x-axis
   */
  xStart?: number;
  /**
   * End value for x-axis
   */
  xEnd?: number;
  /**
   * The width of the chart
   */
  width?: number | string;
  /**
   * The height of the chart
   */
  height?: number | string;
  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * TrayChart component displays light accumulation data over time with a clean, minimalist design.
 * It's designed for compact display of trend data with start and end values.
 */
export const TrayChart: React.FC<TrayChartProps> = ({
  title,
  subtitle = 'h, accum',
  data,
  xStart = 0,
  xEnd,
  width = '100%',
  height = 40,
  className,
}) => {
  const theme = useTheme();
  
  // Determine the end value if not provided
  const computedXEnd = xEnd || (data && data.length > 0 ? Math.max(...data.map(point => point?.[0] || 0)) : 100);

  // Prepare the chart data in the format required by Chart.js
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: title,
            data: [],
            borderColor: theme.palette.text.primary,
            backgroundColor: 'transparent',
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 3,
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels: data.map(point => point?.[0]?.toString() || '0'),
      datasets: [
        {
          label: title,
          data: data.map(point => point?.[1] || 0),
          borderColor: theme.palette.text.primary,
          backgroundColor: 'transparent',
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 3,
          borderWidth: 1,
        },
      ],
    };
  }, [data, title, theme.palette.text.primary]);

  // Configure chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
        min: xStart,
        max: computedXEnd,
      },
      y: {
        display: false,
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        displayColors: false,
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 8,
        titleFont: {
          size: 12,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          title: () => {
            return `${title}`;
          },
          label: (context) => {
            return `Value: ${context.parsed.y}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    elements: {
      point: {
        radius: (ctx) => {
          // Only show points at the ends of the line
          const index = ctx.dataIndex;
          return (index === 0 || index === data.length - 1) ? 2 : 0;
        },
        hoverRadius: 4,
      },
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <Paper
      sx={{
        width,
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
      }}
      className={className}
    >
      {/* Title/label section */}
      <Box
        sx={{
          width: '80px',
          p: 1,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <Typography 
          variant="caption" 
          component="div"
          sx={{ 
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '12px',
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="caption" 
          component="div"
          sx={{ 
            fontSize: '10px',
            lineHeight: '10px',
            color: theme.palette.text.secondary,
            mt: 0.5,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
      
      {/* Chart section */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#F7F9FD',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            p: 1,
          }}
        >
          <Line data={chartData} options={chartOptions} />
        </Box>
        
        {/* Value indicators */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            p: 0.5,
          }}
        >
          <Typography 
            variant="caption" 
            component="div"
            sx={{ 
              fontSize: '8px',
              lineHeight: '8px',
              textAlign: 'center',
            }}
          >
            {xStart.toFixed(1)}
          </Typography>
        </Box>
        
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 0.5,
          }}
        >
          <Typography 
            variant="caption" 
            component="div"
            sx={{ 
              fontSize: '8px',
              lineHeight: '8px',
              textAlign: 'center',
            }}
          >
            {data.length > 0 ? data[data.length - 1][1] : '0'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default TrayChart;