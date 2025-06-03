import React, { useState } from 'react';
import { Box, Typography, Paper, Slider } from '@mui/material';
import { ProgressMeter } from '../shared/components/ui/ProgressMeter';

const ProgressMeterExample: React.FC = () => {
  const [progressValue, setProgressValue] = useState<number>(75);

  const handleProgressChange = (_event: Event, newValue: number | number[]) => {
    setProgressValue(newValue as number);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        ProgressMeter Component Example
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Interactive ProgressMeter
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%', mb: 4 }}>
          <ProgressMeter value={progressValue} width={200} />
        </Box>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <Typography id="progress-slider" gutterBottom>
            Adjust progress value:
          </Typography>
          <Slider
            value={progressValue}
            onChange={handleProgressChange}
            aria-labelledby="progress-slider"
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />
        </Box>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Disabled ProgressMeter
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <ProgressMeter value={75} width={200} disabled />
        </Box>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Different Widths
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ProgressMeter value={75} width={100} />
          <ProgressMeter value={75} width={200} />
          <ProgressMeter value={75} width={300} />
        </Box>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom>
          Different Progress Values
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ProgressMeter value={25} width={200} />
          <ProgressMeter value={50} width={200} />
          <ProgressMeter value={75} width={200} />
          <ProgressMeter value={100} width={200} />
        </Box>
      </Paper>
    </Box>
  );
};

export default ProgressMeterExample;