import React from 'react';
import { MetricCardsContainer } from '../shared/components/ui/MetricCardsContainer';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import Co2Icon from '@mui/icons-material/Co2';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { Box, Typography, Button, FormControlLabel, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

// Set consistent styling for icons
const iconStyle = { color: '#9CA3AF', opacity: 0.7 };

// Sample metrics data that matches the design from the Figma JSON
const demoMetrics = [
  {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    icon: <DeviceThermostatIcon style={iconStyle} />,
  },
  {
    title: 'Rel. Humidity',
    value: '65%',
    targetValue: '68%',
    icon: <WaterDropIcon style={iconStyle} />,
  },
  {
    title: 'CO₂ Level',
    value: '860',
    targetValue: '800-900ppm',
    icon: <Co2Icon style={iconStyle} />,
  },
  {
    title: 'Yield',
    value: '51KG',
    targetValue: '+1.5Kg',
    icon: <AgricultureIcon style={iconStyle} />,
  },
  {
    title: 'Nursery Station Utilization',
    value: '75%',
    targetValue: '+5%',
    icon: <CalendarViewMonthIcon style={iconStyle} />,
  },
  {
    title: 'Cultivation Area Utilization',
    value: '90%',
    targetValue: '+15%',
    icon: <ViewWeekIcon style={iconStyle} />,
  },
];

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'center',
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

const ExampleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

/**
 * MetricCardsContainerExample component showcases the MetricCardsContainer in various configurations.
 */
const MetricCardsContainerExample: React.FC = () => {
  const [useFluidGrid, setUseFluidGrid] = React.useState(false);
  const [displayedMetrics, setDisplayedMetrics] = React.useState(demoMetrics);

  // Toggle between Material UI Grid and CSS Grid layouts
  const handleLayoutToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseFluidGrid(event.target.checked);
  };

  // Toggle number of cards shown
  const handleShowAll = () => {
    setDisplayedMetrics(demoMetrics);
  };

  const handleShowFewer = () => {
    setDisplayedMetrics(demoMetrics.slice(0, 3));
  };

  const handleShowMore = () => {
    const extendedMetrics = [
      ...demoMetrics,
      ...demoMetrics.map((metric) => ({...metric, title: `${metric.title} (Copy)`}))
    ];
    setDisplayedMetrics(extendedMetrics);
  };

  return (
    <StyledContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        Vertical Farming Control Panel
      </Typography>
      
      <ControlsContainer>
        <FormControlLabel
          control={
            <Switch
              checked={useFluidGrid}
              onChange={handleLayoutToggle}
              color="primary"
            />
          }
          label="Use fluid grid layout"
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={handleShowFewer} size="small">
            Fewer Cards
          </Button>
          <Button variant="outlined" onClick={handleShowAll} size="small">
            Standard
          </Button>
          <Button variant="outlined" onClick={handleShowMore} size="small">
            More Cards
          </Button>
        </Box>
      </ControlsContainer>
      
      <ExampleSection>
        <Typography variant="h6" gutterBottom>
          Metric Cards
        </Typography>
        
        <MetricCardsContainer 
          metrics={displayedMetrics}
          useFluidGrid={useFluidGrid}
        />
      </ExampleSection>
    </StyledContainer>
  );
};

export default MetricCardsContainerExample;