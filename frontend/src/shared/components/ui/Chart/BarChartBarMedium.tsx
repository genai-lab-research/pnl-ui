import React from 'react';

import { Box } from '@mui/material';

import { StatData } from '../../../types/metrics';
import { DayIndicator } from './DayIndicator';

interface BarChartBarMediumProps {
  data: StatData[];
  barColor?: string;
  maxValue?: number;
  fullLabels?: string[]; // Optional array of full label texts for tooltips
}

const BarChartBarMedium: React.FC<BarChartBarMediumProps> = ({
  data,
  barColor = '#1976d2',
  maxValue,
  fullLabels,
}) => {
  const calculatedMaxValue = maxValue || Math.max(...data.map((item) => item.value)) * 1.2;

  // Determine what data to display based on data length
  let displayData = data;
  let skipInterval = 0;

  // For monthly data (typically 30 days), show every 3rd day
  if (data.length > 12 && data.length <= 31) {
    skipInterval = 2; // Show every 3rd bar (indexes 0, 3, 6, etc.)
  }
  // For very long data, just show a sample across the range
  else if (data.length > 31) {
    // Show at most 12 bars spread evenly across the dataset
    const maxBars = 12;
    const step = Math.max(1, Math.floor(data.length / maxBars));
    displayData = [];
    for (let i = 0; i < data.length; i += step) {
      if (displayData.length < maxBars) {
        displayData.push(data[i]);
      }
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        height: '100%',
        gap: data.length > 7 ? 0.25 : 0.5, // Reduce gap for many bars
      }}
    >
      {displayData.map((item, index) => {
        const height = (item.value / calculatedMaxValue) * 100;
        const fullLabel = fullLabels ? fullLabels[index] : undefined;

        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexGrow: 1,
              height: '100%',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: `${height}%`,
                backgroundColor: barColor,
                borderRadius: '2px 2px 0 0',
                minHeight: 4,
                transition: 'height 0.3s ease',
              }}
            />
            <DayIndicator day={item.day} fullText={fullLabel} />
          </Box>
        );
      })}
    </Box>
  );
};

export default BarChartBarMedium;
