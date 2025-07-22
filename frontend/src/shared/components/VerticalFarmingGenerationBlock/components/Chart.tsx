import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { ChartContainer } from '../styles';
import { useChartConfig } from '../hooks/useChartConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

interface ChartProps {
  data: number[];
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
  const { chartData, options } = useChartConfig(data);

  return (
    <ChartContainer>
      <Line data={chartData} options={options} />
    </ChartContainer>
  );
};