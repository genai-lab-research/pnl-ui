import React from 'react';
import { Box, Typography } from '@mui/material';
import { ContainerStatisticsCard } from '../shared/components/ui/ContainerStatisticsCard';

const ContainerStatisticsCardExample: React.FC = () => {
  // Sample data for the charts
  const yieldData = [
    { day: 'Mon', value: 60 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 55 },
    { day: 'Thu', value: 40 },
    { day: 'Fri', value: 65 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ];

  const utilizationData = [
    { day: 'Mon', value: 85 },
    { day: 'Tue', value: 70 },
    { day: 'Wed', value: 80 },
    { day: 'Thu', value: 65 },
    { day: 'Fri', value: 90 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Container Statistics Card Example
      </Typography>
      <Typography variant="body1" paragraph>
        The ContainerStatisticsCard component displays container statistics including a title, total count, and two bar charts showing yield and space utilization data over a week.
      </Typography>
      
      <Box display="flex" flexDirection="column" gap={3} maxWidth={400}>
        <ContainerStatisticsCard 
          title="Physical Containers"
          subtitle="Weekly"
          totalCount={4}
          yieldData={yieldData}
          utilizationData={utilizationData}
          avgYield="63KG"
          totalYield="81KG"
          avgUtilization="80%"
          currentDay={4} // Friday
        />
      </Box>
    </Box>
  );
};

export default ContainerStatisticsCardExample;