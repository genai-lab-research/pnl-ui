import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Page 3 Component
 * 
 * Displays the Main Lettuce Container title with a GenerationBlock component
 * in a single row layout as specified in the requirements.
 */
export const Page3: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '16px',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Left-aligned title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600, // Changed from 700 to 600 as per QA report
          color: '#000000',
          fontSize: '24px',
          lineHeight: '32px',
        }}
      >
        Main Lettuce Container
      </Typography>
    </Box>
  );
};

export default Page3;