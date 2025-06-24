import { useMemo } from 'react';
import { ChartOptions } from 'chart.js';

/**
 * Custom hook to generate Chart.js configuration for the generation block graph
 * @param data Array of data points for the graph
 * @returns Chart.js configuration options and data
 */
export const useChartConfig = (data: number[]) => {
  const chartData = useMemo(() => {
    return {
      labels: Array(data.length).fill(''),
      datasets: [
        {
          data,
          borderColor: '#1BE33C',
          borderWidth: 1.5,
          pointBackgroundColor: data.length > 0 ? ['transparent', ...Array(data.length - 2).fill('transparent'), '#000'] : [],
          pointBorderColor: data.length > 0 ? ['transparent', ...Array(data.length - 2).fill('transparent'), '#000'] : [],
          pointBorderWidth: data.length > 0 ? [0, ...Array(data.length - 2).fill(0), 1] : [],
          pointRadius: data.length > 0 ? [0, ...Array(data.length - 2).fill(0), 3] : [],
          tension: 0.4,
          fill: false,
          backgroundColor: 'rgba(27, 227, 60, 0.7)',
        },
      ],
    };
  }, [data]);

  const options: ChartOptions<'line'> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: false,
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
        line: {
          borderWidth: 1,
        },
      },
    };
  }, []);

  return { chartData, options };
};