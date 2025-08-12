import React from 'react';
import { Box, CircularProgress, Backdrop } from '@mui/material';

export const LoadingOverlay: React.FC = () => {
  return (
    <Backdrop
      open={true}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    </Backdrop>
  );
};