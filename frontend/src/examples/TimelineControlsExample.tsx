import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { TimelineControls, PlayState } from '../shared/components/ui/TimelineControls';

const TimelineControlsExample: React.FC = () => {
  const [playState, setPlayState] = useState<PlayState>('paused');

  const handlePlayPause = () => {
    setPlayState(prevState => prevState === 'playing' ? 'paused' : 'playing');
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        TimelineControls Component Example
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Default TimelineControls
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <TimelineControls
            playState={playState}
            onPlayPauseClick={handlePlayPause}
            onPreviousClick={() => console.log('Previous clicked')}
            onNextClick={() => console.log('Next clicked')}
            onRepeatClick={() => console.log('Repeat clicked')}
          />
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Current state: <strong>{playState}</strong>
        </Typography>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Disabled TimelineControls
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <TimelineControls
            playState="paused"
            disabled
          />
        </Box>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          TimelineControls in Playing State
        </Typography>
        <Box sx={{ width: '400px', maxWidth: '100%' }}>
          <TimelineControls
            playState="playing"
            onPlayPauseClick={() => console.log('Play/Pause clicked')}
            onPreviousClick={() => console.log('Previous clicked')}
            onNextClick={() => console.log('Next clicked')}
            onRepeatClick={() => console.log('Repeat clicked')}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TimelineControlsExample;