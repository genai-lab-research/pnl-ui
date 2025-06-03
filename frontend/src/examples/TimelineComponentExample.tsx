import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import TimelineComponent from '../shared/components/ui/TimelineComponent';

const TimelineComponentExample: React.FC = () => {
  const [selectedInterval, setSelectedInterval] = useState<number>(3);

  const handleIntervalClick = (index: number) => {
    setSelectedInterval(index);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        Timeline Component Example
      </Typography>
      
      <Box sx={{ my: 2 }}>
        <TimelineComponent
          selectedInterval={selectedInterval}
          onIntervalClick={handleIntervalClick}
          labels={{ start: '01\nApr', end: '15\nApr' }}
          intervalCount={12}
        />
      </Box>
      
      <Typography variant="body2" sx={{ mt: 2 }}>
        Selected interval: {selectedInterval + 1}
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Disabled Timeline Example
        </Typography>
        <TimelineComponent
          selectedInterval={2}
          intervalCount={8}
          disabled
          labels={{ start: 'Start', end: 'End' }}
        />
      </Box>
    </Paper>
  );
};

export default TimelineComponentExample;