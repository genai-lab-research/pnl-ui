import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ContainerStatisticsProps } from './types';
import {
  StyledContainer,
  StyledHeader,
  StyledTitle,
  StyledCountBadge,
  StyledCount,
  StyledChartsContainer,
  StyledChartWrapper,
  StyledChartHeader,
  StyledChartTitle,
  StyledValueContainer,
  StyledValueGroup,
  StyledValueLabel,
  StyledValue,
  StyledChartContainer,
  StyledDayLabels,
  StyledDayLabel
} from './ContainerStatistics.styles';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ContainerStatistics: React.FC<ContainerStatisticsProps> = ({
  title,
  containerCount,
  yieldData,
  spaceUtilization,
  dayLabels,
  timeRange = 'Week'
}) => {
  // Generate labels based on time range
  const getChartLabels = () => {
    if (dayLabels && dayLabels.length > 0) return dayLabels;
    
    switch (timeRange) {
      case 'Week':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'Month':
        // For month view, generate day labels (1-30/31)
        return Array.from({ length: yieldData.dailyData.length }, (_, i) => `Day ${i + 1}`);
      case 'Quarter':
        // For quarter view, calculate last full quarter
        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const currentQuarter = Math.floor(currentMonth / 3);
        const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
        const lastQuarterStart = lastQuarter * 3;
        return allMonths.slice(lastQuarterStart, lastQuarterStart + 3);
      case 'Year':
        // All month names for year view
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, yieldData.dailyData.length);
      default:
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
  };
  
  // Sample data based on time range
  const sampleData = (data: number[], labels: string[]) => {
    // For month view, sample every 3rd day only if more than 12 entries
    if (timeRange === 'Month' && data.length > 12) {
      const sampledData: number[] = [];
      const sampledLabels: string[] = [];
      
      for (let i = 0; i < data.length; i += 3) {
        sampledData.push(data[i]);
        sampledLabels.push(labels[i]);
      }
      
      return { sampledData, sampledLabels };
    }
    
    // For other views, limit to 12 bars if needed
    const maxBars = 12;
    if (data.length <= maxBars) {
      return { sampledData: data, sampledLabels: labels };
    }
    
    // Calculate step size to get approximately maxBars items
    const step = Math.ceil(data.length / maxBars);
    const sampledData: number[] = [];
    const sampledLabels: string[] = [];
    
    for (let i = 0; i < data.length; i += step) {
      if (sampledData.length < maxBars) {
        sampledData.push(data[i]);
        sampledLabels.push(labels[i]);
      }
    }
    
    return { sampledData, sampledLabels };
  };
  
  const fullChartLabels = getChartLabels();
  
  // Sample yield data and labels
  const { sampledData: sampledYieldData, sampledLabels: chartLabels } = sampleData(
    yieldData.dailyData,
    fullChartLabels
  );
  
  // Sample space utilization data (using same sampling as yield for consistency)
  const { sampledData: sampledSpaceData } = sampleData(
    spaceUtilization.dailyData,
    fullChartLabels
  );
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#DEDEDE',
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const yieldChartData = {
    labels: chartLabels,
    datasets: [
      {
        data: sampledYieldData,
        backgroundColor: '#3EAE4E',
        borderRadius: 4,
        barThickness: 16,
        maxBarThickness: 16,
      },
    ],
  };

  const spaceUtilizationChartData = {
    labels: chartLabels,
    datasets: [
      {
        data: sampledSpaceData,
        backgroundColor: '#65A9E7',
        borderRadius: 4,
        barThickness: 16,
        maxBarThickness: 16,
      },
    ],
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>{title}</StyledTitle>
        <StyledCountBadge>
          <StyledCount>{containerCount}</StyledCount>
        </StyledCountBadge>
      </StyledHeader>
      
      <StyledChartsContainer>
        {/* Yield Chart */}
        <StyledChartWrapper>
          <StyledChartHeader>
            <StyledChartTitle>Yield</StyledChartTitle>
            <StyledValueContainer>
              <StyledValueGroup>
                <StyledValueLabel>AVG</StyledValueLabel>
                <StyledValue>{yieldData.average}KG</StyledValue>
              </StyledValueGroup>
              <StyledValueGroup>
                <StyledValueLabel>Total</StyledValueLabel>
                <StyledValue>{yieldData.total}KG</StyledValue>
              </StyledValueGroup>
            </StyledValueContainer>
          </StyledChartHeader>
          
          <StyledChartContainer>
            <Bar options={chartOptions} data={yieldChartData} />
          </StyledChartContainer>
          
          <StyledDayLabels>
            {chartLabels.map((label, index) => (
              <StyledDayLabel key={index}>{label}</StyledDayLabel>
            ))}
          </StyledDayLabels>
        </StyledChartWrapper>
        
        {/* Space Utilization Chart */}
        <StyledChartWrapper>
          <StyledChartHeader>
            <StyledChartTitle>Space Utilization</StyledChartTitle>
            <StyledValueContainer>
              <StyledValueGroup>
                <StyledValueLabel>AVG</StyledValueLabel>
                <StyledValue>{spaceUtilization.average}%</StyledValue>
              </StyledValueGroup>
            </StyledValueContainer>
          </StyledChartHeader>
          
          <StyledChartContainer>
            <Bar options={chartOptions} data={spaceUtilizationChartData} />
          </StyledChartContainer>
          
          <StyledDayLabels>
            {chartLabels.map((label, index) => (
              <StyledDayLabel key={index}>{label}</StyledDayLabel>
            ))}
          </StyledDayLabels>
        </StyledChartWrapper>
      </StyledChartsContainer>
    </StyledContainer>
  );
};

export default ContainerStatistics;
