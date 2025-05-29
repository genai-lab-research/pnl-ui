import React, { useState } from 'react';
import { Box, Grid, ButtonGroup, Button, Paper, Stack, Typography } from '@mui/material';
import { TotalContainerIndicator } from '../shared/components/ui/TotalContainerIndicator';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

/**
 * Example component that demonstrates the TotalContainerIndicator with controls
 * to change the total count value.
 */
const TotalContainerIndicatorExample = () => {
  const [containerCount, setContainerCount] = useState<number>(1);

  const incrementCount = () => {
    setContainerCount(prevCount => prevCount + 1);
  };

  const decrementCount = () => {
    setContainerCount(prevCount => Math.max(0, prevCount - 1));
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700 }}>
      <Typography variant="h5" gutterBottom>
        Total Container Indicator Example
      </Typography>
      
      <Stack spacing={3}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This example demonstrates the TotalContainerIndicator component with interactive controls.
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TotalContainerIndicator value={containerCount} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                Adjust container count:
              </Typography>
              
              <ButtonGroup variant="outlined" size="small">
                <Button 
                  onClick={decrementCount} 
                  startIcon={<RemoveCircle />}
                  disabled={containerCount <= 0}
                >
                  Decrease
                </Button>
                <Button 
                  onClick={incrementCount} 
                  startIcon={<AddCircle />}
                >
                  Increase
                </Button>
              </ButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
};

export default TotalContainerIndicatorExample;