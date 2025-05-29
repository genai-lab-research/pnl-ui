import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { TimePeriodSelector, TimePeriod } from '../shared/components/ui/TimePeriodSelector';

const TimePeriodSelectorExample: React.FC = () => {
  const [periodValue, setPeriodValue] = useState<TimePeriod>('week');

  const handlePeriodChange = (value: TimePeriod) => {
    setPeriodValue(value);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        TimePeriodSelector Component Example
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Default TimePeriodSelector
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <TimePeriodSelector
            value={periodValue}
            onChange={handlePeriodChange}
          />
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Selected value: <strong>{periodValue}</strong>
        </Typography>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          TimePeriodSelector with Disabled Option
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <TimePeriodSelector
            value={periodValue}
            onChange={handlePeriodChange}
            options={[
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month', disabled: true },
              { label: 'Quarter', value: 'quarter' },
              { label: 'Year', value: 'year' },
            ]}
          />
        </Box>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Disabled TimePeriodSelector
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <TimePeriodSelector
            value="week"
            onChange={() => {}}
            disabled
          />
        </Box>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Custom Options TimePeriodSelector
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <TimePeriodSelector
            value={periodValue}
            onChange={handlePeriodChange}
            options={[
              { label: 'Daily', value: 'week' },
              { label: 'Weekly', value: 'month' },
              { label: 'Monthly', value: 'quarter' },
            ]}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TimePeriodSelectorExample;