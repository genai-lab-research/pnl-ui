import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { TrayChart } from '../shared/components/ui/TrayChart';

const TrayChartExample: React.FC = () => {
  // Sample data for light accumulation
  const lightData = [
    [0, 0],
    [50, 40],
    [100, 80],
    [150, 120],
    [200, 160],
    [250, 220],
    [270, 270],
  ];

  // Sample data for temperature
  const temperatureData = [
    [0, 20],
    [50, 22],
    [100, 25],
    [150, 30],
    [200, 45],
    [250, 85],
    [270, 95],
  ];

  // Sample data for humidity
  const humidityData = [
    [0, 50],
    [50, 60],
    [100, 45],
    [150, 65],
    [200, 55],
    [250, 70],
    [270, 60],
  ];

  return (
    <Box sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Tray Chart Examples
      </Typography>
      
      <Typography variant="body1" paragraph>
        The TrayChart component displays compact line charts for monitoring various metrics.
      </Typography>
      
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Single Tray Chart
        </Typography>
        <TrayChart 
          title="Light" 
          subtitle="h, accum" 
          data={lightData} 
          width="100%" 
          height={40}
          xStart={0}
          xEnd={270}
        />
      </Paper>
      
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Multiple Tray Charts
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TrayChart 
            title="Light" 
            subtitle="h, accum" 
            data={lightData} 
            width="100%" 
            height={40}
            xStart={0}
            xEnd={270}
          />
          <TrayChart 
            title="Temperature" 
            subtitle="°C, daily" 
            data={temperatureData} 
            width="100%" 
            height={40}
            xStart={0}
            xEnd={270}
          />
          <TrayChart 
            title="Humidity" 
            subtitle="%, hourly" 
            data={humidityData} 
            width="100%" 
            height={40}
            xStart={0}
            xEnd={270}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TrayChartExample;