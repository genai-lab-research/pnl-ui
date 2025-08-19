import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MiniBarChartProps } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const ChartJSBarChart: React.FC<MiniBarChartProps> = ({
  data,
  color,
  mutedColor = '#EAEEF6',
  maxHeight = 100,
  className,
}): JSX.Element => {
  const chartData = {
    labels: data.map(point => point.day),
    datasets: [
      {
        data: data.map(point => point.value),
        backgroundColor: data.map(point => 
          point.value > 0 ? color : mutedColor
        ),
        borderColor: data.map(point => 
          point.value > 0 ? color : mutedColor
        ),
        borderWidth: 0,
        borderRadius: 2,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const dataIndex = context[0].dataIndex;
            return data[dataIndex].day;
          },
          label: (context: any) => {
            return `${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          color: '#6B7280',
        },
      },
      y: {
        display: false,
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <div className={className} style={{ height: maxHeight }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};