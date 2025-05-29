import React, { useState } from 'react';
import { SegmentedButton } from '../shared/components/ui/SegmentedButton';
import { Box, Typography, Paper } from '@mui/material';

export const SegmentedButtonExample = () => {
  const [viewMode, setViewMode] = useState('physical');
  const [timeframe, setTimeframe] = useState('week');

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Segmented Button Example
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Basic Usage
        </Typography>
        <SegmentedButton
          value={viewMode}
          options={[
            { value: 'physical', label: 'Physical' },
            { value: 'virtual', label: 'Virtual' }
          ]}
          onChange={(value) => setViewMode(value)}
        />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Selected value: <strong>{viewMode}</strong>
        </Typography>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Multiple Options
        </Typography>
        <SegmentedButton
          value={timeframe}
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' }
          ]}
          onChange={(value) => setTimeframe(value)}
        />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Selected value: <strong>{timeframe}</strong>
        </Typography>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Disabled State
        </Typography>
        <SegmentedButton
          value="physical"
          options={[
            { value: 'physical', label: 'Physical' },
            { value: 'virtual', label: 'Virtual' }
          ]}
          onChange={() => {}}
          disabled
        />
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Different Sizes
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" gutterBottom>
              Small
            </Typography>
            <SegmentedButton
              size="small"
              value={viewMode}
              options={[
                { value: 'physical', label: 'Physical' },
                { value: 'virtual', label: 'Virtual' }
              ]}
              onChange={(value) => setViewMode(value)}
            />
          </Box>
          
          <Box>
            <Typography variant="body2" gutterBottom>
              Medium (default)
            </Typography>
            <SegmentedButton
              value={viewMode}
              options={[
                { value: 'physical', label: 'Physical' },
                { value: 'virtual', label: 'Virtual' }
              ]}
              onChange={(value) => setViewMode(value)}
            />
          </Box>
          
          <Box>
            <Typography variant="body2" gutterBottom>
              Large
            </Typography>
            <SegmentedButton
              size="large"
              value={viewMode}
              options={[
                { value: 'physical', label: 'Physical' },
                { value: 'virtual', label: 'Virtual' }
              ]}
              onChange={(value) => setViewMode(value)}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SegmentedButtonExample;