import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { TimelapsSelector } from '../shared/components/ui/TimelapsSelector';

const TimelapsSelectorExample: React.FC = () => {
  const [currentDay, setCurrentDay] = useState<number>(0);

  const handleDaySelect = (day: number) => {
    setCurrentDay(day);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        TimelapsSelector Component Example
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Default TimelapsSelector
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <TimelapsSelector
            currentDay={currentDay}
            onDaySelect={handleDaySelect}
          />
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Selected day: <strong>{days[currentDay]}</strong>
        </Typography>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Disabled TimelapsSelector
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <TimelapsSelector
            currentDay={0}
            disabled
          />
        </Box>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          TimelapsSelector with Fixed Day (Friday)
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <TimelapsSelector
            currentDay={4}
            onDaySelect={(day) => console.log(`Day ${day} selected`)}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TimelapsSelectorExample;