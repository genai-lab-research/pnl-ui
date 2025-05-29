import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { PreviousButton } from '../shared/components/ui/PreviousButton';
import { NextButton } from '../shared/components/ui/NextButton';

const NavigationButtonsExample: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Navigation Buttons Example
        </Typography>
        
        <Typography variant="body1" paragraph>
          Below are examples of our navigation button components that can be used to create consistent forward and backward navigation through multi-step processes.
        </Typography>
        
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Default Buttons
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <PreviousButton />
            <NextButton />
          </Box>
        </Box>
        
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Without Icons
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <PreviousButton hideIcon>Back</PreviousButton>
            <NextButton hideIcon>Forward</NextButton>
          </Box>
        </Box>
        
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Disabled State
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <PreviousButton disabled />
            <NextButton disabled />
          </Box>
        </Box>
        
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Primary Color
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <PreviousButton color="primary" />
            <NextButton color="primary" />
          </Box>
        </Box>
        
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Contained Variant
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <PreviousButton variant="contained" />
            <NextButton variant="contained" />
          </Box>
        </Box>
        
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Full Width (Responsive)
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <PreviousButton fullWidth />
            <NextButton fullWidth />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default NavigationButtonsExample;