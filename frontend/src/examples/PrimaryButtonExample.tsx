import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { PrimaryButton } from '../shared/components/ui/PrimaryButton';

const PrimaryButtonExample: React.FC = () => {
  const handleClick = () => {
    console.log('Primary button clicked');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Primary Button Examples
      </Typography>
      
      <Stack spacing={2} direction="column" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Default Primary Button
          </Typography>
          <PrimaryButton onClick={handleClick}>Create Container</PrimaryButton>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Disabled Primary Button
          </Typography>
          <PrimaryButton disabled>Create Container</PrimaryButton>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Small Primary Button
          </Typography>
          <PrimaryButton size="small">Create Container</PrimaryButton>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Large Primary Button
          </Typography>
          <PrimaryButton size="large">Create Container</PrimaryButton>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Full Width Primary Button
          </Typography>
          <PrimaryButton fullWidth>Create Container</PrimaryButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default PrimaryButtonExample;