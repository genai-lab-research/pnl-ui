import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { EnvironmentDashboard } from '../shared/components/ui/EnvironmentDashboard';

const EnvironmentDashboardExample: React.FC = () => {
  // Sample data for charts
  const areaData = [[0, 0], [50, 0.0006], [100, 0.0009], [150, 0.0010], [200, 0.0011], [250, 0.0012]];
  const lightData = [[0, 0], [50, 40], [100, 80], [150, 120], [200, 160], [250, 220], [270, 270]];
  const waterData = [[0, 0], [50, 5], [100, 10], [150, 15], [200, 20], [250, 25], [270, 29]];
  const airTempData = [[0, 21.0], [50, 21.1], [100, 21.1], [150, 21.0], [200, 21.2], [250, 21.1], [270, 21.2]];
  const humidityData = [[0, 65], [50, 67], [100, 68], [150, 69], [200, 69], [250, 70], [270, 70.1]];
  const co2Data = [[0, 900], [50, 897], [100, 899], [150, 900], [200, 896], [250, 898], [270, 897]];
  const waterTempData = [[0, 21.0], [50, 21.0], [100, 21.1], [150, 21.0], [200, 21.1], [250, 21.0], [270, 21.1]];
  const phData = [[0, 6.5], [50, 6.4], [100, 6.3], [150, 6.3], [200, 6.3], [250, 6.3], [270, 6.3]];
  const ecData = [[0, 1.8], [50, 1.8], [100, 1.9], [150, 1.8], [200, 1.9], [250, 1.8], [270, 1.9]];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Environment Dashboard Example
      </Typography>
      
      <Typography variant="body1" paragraph>
        The EnvironmentDashboard component displays multiple environmental metrics for vertical farming in a compact, organized layout.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Default Dashboard
            </Typography>
            <EnvironmentDashboard 
              areaData={areaData}
              lightData={lightData}
              waterData={waterData}
              airTempData={airTempData}
              humidityData={humidityData}
              co2Data={co2Data}
              waterTempData={waterTempData}
              phData={phData}
              ecData={ecData}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Custom Width Dashboard
            </Typography>
            <EnvironmentDashboard 
              width="350px"
              areaData={areaData}
              lightData={lightData}
              waterData={waterData}
              airTempData={airTempData}
              humidityData={humidityData}
              co2Data={co2Data}
              waterTempData={waterTempData}
              phData={phData}
              ecData={ecData}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnvironmentDashboardExample;