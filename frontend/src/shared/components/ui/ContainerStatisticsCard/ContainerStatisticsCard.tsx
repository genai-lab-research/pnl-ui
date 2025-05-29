import React from 'react';
import { Card, CardProps, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

export interface ChartDataItem {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  value: number;
}

export interface ContainerStatisticsCardProps extends Omit<CardProps, 'title'> {
  /**
   * The title of the container statistics card.
   */
  title: string;

  /**
   * Optional subtitle shown in parentheses after the title.
   */
  subtitle?: string;

  /**
   * The total count number to display.
   */
  totalCount: number;

  /**
   * First chart data with yield information.
   */
  yieldData: ChartDataItem[];

  /**
   * Second chart data with space utilization information.
   */
  utilizationData: ChartDataItem[];

  /**
   * The average yield value to display.
   */
  avgYield: string;

  /**
   * The total yield value to display.
   */
  totalYield: string;

  /**
   * The average space utilization percentage to display.
   */
  avgUtilization: string;

  /**
   * Current day for highlighting the chart (0 = Monday, 6 = Sunday).
   */
  currentDay?: number;

  /**
   * Custom CSS class for the container statistics card.
   */
  className?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  boxShadow: 'none',
  border: '1px solid #E4E4E7',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',

  [theme.breakpoints.down('sm')]: {
    padding: '12px',
    gap: '12px',
  },
}));

const CardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const CardTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  letterSpacing: '0.15px',
  color: '#000000',

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    lineHeight: '20px',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#929292',
  marginLeft: '4px',

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: '18px',
  },
}));

const TotalCountBox = styled(Box)({
  backgroundColor: '#F7F7F7',
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
});

const TotalCountText = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '23.625px',
  lineHeight: '32px',
  color: '#0F1729',
});

const ChartContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',

  [theme.breakpoints.down('sm')]: {
    gap: '6px',
  },
}));

const ChartHeader = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const ChartTitle = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '12px',
  lineHeight: '20px',
  letterSpacing: '0',
  textTransform: 'uppercase',
  color: '#000000',
});

const StatsContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
});

const StatGroup = styled(Box)({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
});

const StatLabel = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '20px',
  textTransform: 'uppercase',
  color: '#000000',
  opacity: 0.9,
});

const StatValue = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '10px',
  lineHeight: '20px',
  textTransform: 'uppercase',
  color: '#000000',
});

const ChartsHorizontalContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  alignItems: 'flex-start',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: '16px',
  },
}));

const ChartWrapper = styled(Box)({
  flex: 1,
  minWidth: 0,
});

const CurrentDayIndicator = styled('div')({
  width: '0',
  height: '0',
  borderLeft: '4px solid transparent',
  borderRight: '4px solid transparent',
  borderBottom: '6px solid #000000',
  margin: '2px auto 0',
});

/**
 * ContainerStatisticsCard component displays container statistics with a title, total count number,
 * and two bar charts showing yield and space utilization data over a week.
 * 
 * Features:
 * - Clean, responsive layout matching the design reference
 * - Two bar charts for yield and space utilization data
 * - Displays average and total statistics for yield
 * - Displays average statistics for space utilization
 * - Highlights the current day in the charts
 * - Fully customizable with theme support
 * 
 * @component
 * @example
 * ```tsx
 * <ContainerStatisticsCard
 *   title="Physical Containers"
 *   subtitle="Weekly"
 *   totalCount={4}
 *   yieldData={[
 *     { day: 'Mon', value: 60 },
 *     { day: 'Tue', value: 45 },
 *     { day: 'Wed', value: 55 },
 *     { day: 'Thu', value: 40 },
 *     { day: 'Fri', value: 65 },
 *     { day: 'Sat', value: 0 },
 *     { day: 'Sun', value: 0 },
 *   ]}
 *   utilizationData={[
 *     { day: 'Mon', value: 85 },
 *     { day: 'Tue', value: 70 },
 *     { day: 'Wed', value: 80 },
 *     { day: 'Thu', value: 65 },
 *     { day: 'Fri', value: 90 },
 *     { day: 'Sat', value: 0 },
 *     { day: 'Sun', value: 0 },
 *   ]}
 *   avgYield="63KG"
 *   totalYield="81KG"
 *   avgUtilization="80%"
 *   currentDay={4} // Friday
 * />
 * ```
 */
export const ContainerStatisticsCard: React.FC<ContainerStatisticsCardProps> = ({
  title,
  subtitle,
  totalCount,
  yieldData,
  utilizationData,
  avgYield,
  totalYield,
  avgUtilization,
  currentDay,
  className,
  ...props
}) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Chart options
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
        categoryPercentage: 0.8,
        barPercentage: 0.6,
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
        beginAtZero: true,
      },
    },
    elements: {
      bar: {
        borderRadius: {
          topLeft: 2,
          topRight: 2,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    },
  };

  // Yield chart data
  const yieldChartData = {
    labels: days,
    datasets: [
      {
        data: yieldData.map(item => item.value),
        backgroundColor: yieldData.map((_, index) => 
          index === currentDay ? '#55C569' : (index > 4 ? '#EAEEF6' : '#55C569')
        ),
        barThickness: 16,
        borderRadius: {
          topLeft: 2,
          topRight: 2,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    ],
  };

  // Utilization chart data
  const utilizationChartData = {
    labels: days,
    datasets: [
      {
        data: utilizationData.map(item => item.value),
        backgroundColor: utilizationData.map((_, index) => 
          index === currentDay ? '#6DB3ED' : (index > 4 ? '#EAEEF6' : '#6DB3ED')
        ),
        barThickness: 16,
        borderRadius: {
          topLeft: 2,
          topRight: 2,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    ],
  };

  return (
    <StyledCard className={className} {...props}>
      <CardHeader>
        <Box display="flex" alignItems="center">
          <CardTitle variant="h6">{title}</CardTitle>
          {subtitle && <Subtitle variant="body2">({subtitle})</Subtitle>}
        </Box>
        <TotalCountBox>
          <TotalCountText>{totalCount}</TotalCountText>
        </TotalCountBox>
      </CardHeader>

      {/* Horizontal Charts Layout */}
      <ChartsHorizontalContainer>
        {/* Yield Chart */}
        <ChartWrapper>
          <ChartContainer>
            <ChartHeader>
              <ChartTitle>YIELD</ChartTitle>
              <StatsContainer>
                <StatGroup>
                  <StatLabel>AVG</StatLabel>
                  <StatValue>{avgYield}</StatValue>
                </StatGroup>
                <StatGroup>
                  <StatLabel>TOTAL</StatLabel>
                  <StatValue>{totalYield}</StatValue>
                </StatGroup>
              </StatsContainer>
            </ChartHeader>
            <Box height={120}>
              <Bar options={chartOptions} data={yieldChartData} />
            </Box>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              mt={1}
              sx={{
                '& > span': {
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '10px',
                  fontWeight: 400,
                  color: 'rgba(76, 78, 100, 0.6)',
                  letterSpacing: '0.4px',
                  flex: 1,
                  textAlign: 'center',
                }
              }}
            >
              {days.map((day, index) => (
                <Box key={day} display="flex" flexDirection="column" alignItems="center" flex={1}>
                  <span>{day}</span>
                  {index === currentDay && <CurrentDayIndicator />}
                </Box>
              ))}
            </Box>
          </ChartContainer>
        </ChartWrapper>

        {/* Space Utilization Chart */}
        <ChartWrapper>
          <ChartContainer>
            <ChartHeader>
              <ChartTitle>SPACE UTILIZATION</ChartTitle>
              <StatGroup>
                <StatLabel>AVG</StatLabel>
                <StatValue>{avgUtilization}</StatValue>
              </StatGroup>
            </ChartHeader>
            <Box height={120}>
              <Bar options={chartOptions} data={utilizationChartData} />
            </Box>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              mt={1}
              sx={{
                '& > span': {
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '10px',
                  fontWeight: 400,
                  color: 'rgba(76, 78, 100, 0.6)',
                  letterSpacing: '0.4px',
                  flex: 1,
                  textAlign: 'center',
                }
              }}
            >
              {days.map((day, index) => (
                <Box key={day} display="flex" flexDirection="column" alignItems="center" flex={1}>
                  <span>{day}</span>
                  {index === currentDay && <CurrentDayIndicator />}
                </Box>
              ))}
            </Box>
          </ChartContainer>
        </ChartWrapper>
      </ChartsHorizontalContainer>
    </StyledCard>
  );
};

export default ContainerStatisticsCard;