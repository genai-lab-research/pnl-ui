import React from 'react';
import { DestructiveButton } from '../shared/components/ui/DestructiveButton';
import { Box, Typography, Paper, Stack } from '@mui/material';

const DestructiveButtonExample = () => {
  const handleDelete = () => {
    alert('Delete action triggered');
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Destructive Button Examples
      </Typography>
      
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Default
        </Typography>
        <DestructiveButton onClick={handleDelete}>Delete Container</DestructiveButton>
      </Box>
      
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Disabled
        </Typography>
        <DestructiveButton disabled>Delete Container</DestructiveButton>
      </Box>
      
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Size Variants
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <DestructiveButton size="small">Delete Container</DestructiveButton>
          <DestructiveButton>Delete Container</DestructiveButton>
          <DestructiveButton size="large">Delete Container</DestructiveButton>
        </Stack>
      </Box>
      
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Full Width
        </Typography>
        <DestructiveButton fullWidth>Delete Container</DestructiveButton>
      </Box>
    </Paper>
  );
};

export default DestructiveButtonExample;