import React from 'react';
import { 
  Backdrop, 
  Box, 
  CircularProgress, 
  Typography 
} from '@mui/material';

export interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Saving changes...'
}) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
      open={true}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress color="inherit" size={40} />
        <Typography variant="body1" sx={{ color: 'white' }}>
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;