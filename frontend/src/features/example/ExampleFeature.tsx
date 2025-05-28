import React from 'react';

import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';

const ExampleFeature: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Example Feature
        </Typography>
        <Typography variant="body1" paragraph>
          This is an example feature component showing how to structure the application.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6">Section 1</Typography>
              <Typography variant="body2">
                Features should be organized in their own directories with all related components.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Primary Action
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6">Section 2</Typography>
              <Typography variant="body2">
                Each feature can contain multiple components, utilities, hooks, etc.
              </Typography>
              <Button variant="outlined" color="secondary" sx={{ mt: 2 }}>
                Secondary Action
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ExampleFeature;
