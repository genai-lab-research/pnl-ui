import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { StatContainer } from '../../shared/components/ui/Container/StatContainer';
import { containerApi, ContainerSummary } from '../../shared/utils/api';
import { MetricTimeRange } from '../../shared/types/metrics';

// For demo purposes, we'll use a fixed container ID
// In a real application, this would come from the URL/route params
const DEMO_CONTAINER_ID = "container-123";

const ContainerMetricsPage: React.FC = () => {
  const [container, setContainer] = useState<ContainerSummary | null>(null);
  const [timeRange, setTimeRange] = useState<MetricTimeRange>(MetricTimeRange.WEEK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch container details
  useEffect(() => {
    const fetchContainerDetails = async () => {
      try {
        // In a real application, you'd fetch the actual container
        // const response = await containerApi.getContainer(DEMO_CONTAINER_ID);
        
        // For demo purposes, we'll create a mock container
        setContainer({
          id: DEMO_CONTAINER_ID,
          name: "Demo Container",
          type: "physical",
          tenant_name: "Demo Tenant",
          purpose: "development",
          location_city: "San Francisco",
          location_country: "USA",
          status: "connected",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          has_alerts: false
        } as ContainerSummary);
      } catch (err) {
        console.error('Failed to fetch container details:', err);
        setError('Failed to load container details');
      }
    };
    
    fetchContainerDetails();
  }, []);
  
  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: MetricTimeRange,
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            {container ? container.name : 'Container'} Metrics
          </Typography>
          
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="time range"
            size="small"
          >
            <ToggleButton value={MetricTimeRange.WEEK}>
              Week
            </ToggleButton>
            <ToggleButton value={MetricTimeRange.MONTH}>
              Month
            </ToggleButton>
            <ToggleButton value={MetricTimeRange.QUARTER}>
              Quarter
            </ToggleButton>
            <ToggleButton value={MetricTimeRange.YEAR}>
              Year
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StatContainer
              title="Total Yield"
              value="0 kg"
              leftChartTitle="Daily Yield"
              rightChartTitle="Space Utilization"
              useApi={true}
              containerId={DEMO_CONTAINER_ID}
              timeRange={timeRange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StatContainer
              title="Current Environment"
              value="Optimal"
              leftChartTitle="Temperature"
              rightChartTitle="Humidity"
              leftAverage="22°C"
              rightAverage="65%"
              leftChartData={[
                { day: 'Mon', value: 22 },
                { day: 'Tue', value: 22.5 },
                { day: 'Wed', value: 23 },
                { day: 'Thu', value: 22 },
                { day: 'Fri', value: 21.5 },
                { day: 'Sat', value: 21 },
                { day: 'Sun', value: 22 }
              ]}
              rightChartData={[
                { day: 'Mon', value: 65 },
                { day: 'Tue', value: 64 },
                { day: 'Wed', value: 63 },
                { day: 'Thu', value: 67 },
                { day: 'Fri', value: 68 },
                { day: 'Sat', value: 66 },
                { day: 'Sun', value: 65 }
              ]}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatContainer
              title="CO₂ Level"
              value="450 ppm"
              leftChartTitle="Weekly Average"
              leftChartData={[
                { day: 'Mon', value: 450 },
                { day: 'Tue', value: 455 },
                { day: 'Wed', value: 460 },
                { day: 'Thu', value: 445 },
                { day: 'Fri', value: 440 },
                { day: 'Sat', value: 442 },
                { day: 'Sun', value: 450 }
              ]}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatContainer
              title="Crop Count"
              value="230"
              leftChartTitle="By Stage"
              leftChartData={[
                { day: 'Seeded', value: 100 },
                { day: 'Growing', value: 80 },
                { day: 'Harvested', value: 50 }
              ]}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatContainer
              title="Energy Usage"
              value="45 kWh"
              leftChartTitle="Daily Usage"
              leftChartData={[
                { day: 'Mon', value: 42 },
                { day: 'Tue', value: 45 },
                { day: 'Wed', value: 48 },
                { day: 'Thu', value: 43 },
                { day: 'Fri', value: 40 },
                { day: 'Sat', value: 38 },
                { day: 'Sun', value: 37 }
              ]}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ContainerMetricsPage;