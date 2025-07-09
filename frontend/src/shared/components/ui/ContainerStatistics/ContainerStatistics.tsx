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
  dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
}) => {
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
    labels: dayLabels,
    datasets: [
      {
        data: yieldData.dailyData,
        backgroundColor: '#3EAE4E',
        borderRadius: 4,
        barThickness: 16,
        maxBarThickness: 16,
      },
    ],
  };

  const spaceUtilizationChartData = {
    labels: dayLabels,
    datasets: [
      {
        data: spaceUtilization.dailyData,
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
            {dayLabels.map((day, index) => (
              <StyledDayLabel key={index}>{day}</StyledDayLabel>
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
            {dayLabels.map((day, index) => (
              <StyledDayLabel key={index}>{day}</StyledDayLabel>
            ))}
          </StyledDayLabels>
        </StyledChartWrapper>
      </StyledChartsContainer>
    </StyledContainer>
  );
};

export default ContainerStatistics;
