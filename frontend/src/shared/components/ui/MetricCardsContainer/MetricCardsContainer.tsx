import React from 'react';
import { Box, Theme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MetricCard } from '../MetricCard/MetricCard';

export interface MetricData {
  /**
   * The title of the metric card.
   */
  title: string;
  
  /**
   * The current metric value to display.
   */
  value: string | number;
  
  /**
   * Optional target or comparison value to display alongside the main value.
   */
  targetValue?: string | number;
  
  /**
   * The icon to display next to the value.
   */
  icon?: React.ReactNode;
}

export interface MetricCardsContainerProps {
  /**
   * Array of metric data objects to display as cards.
   */
  metrics: MetricData[];
  
  /**
   * Optional CSS class name for the container.
   */
  className?: string;
  
  /**
   * Optional flag to use fluid grid layout instead of fixed columns.
   * When true, uses CSS Grid with auto-fill; when false, uses Material UI Grid.
   */
  useFluidGrid?: boolean;
}

const StyledContainer = styled(Box)(() => ({
  padding: 0, // Remove container padding to match reference
  backgroundColor: 'transparent', // Transparent container background
  width: '100%',
  borderRadius: 0, // No border radius on container
}));

const StyledFluidGrid = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(1), // 8px gap to match reference tighter spacing
  width: '100%',
  
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1), // 8px on medium screens
  },
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1), // 8px on small screens - stack vertically on mobile
  },
  
  // For extra small screens (custom breakpoint)
  '@media (max-width: 600px)': {
    gap: theme.spacing(1), // 8px on extra small screens
  },
}));

/**
 * MetricCardsContainer component displays a responsive grid of metric cards.
 * 
 * Features:
 * - Responsive grid layout that adapts to different screen sizes
 * - Configurable to use either fixed columns or fluid grid layout
 * - Consistent spacing and padding across all breakpoints
 * - Matches the Figma design with proper background color and spacing
 * 
 * @component
 * @example
 * ```tsx
 * const metrics = [
 *   { title: 'Air Temperature', value: '20°C', targetValue: '21°C', icon: <DeviceThermostatIcon /> },
 *   { title: 'Rel. Humidity', value: '65%', targetValue: '68%', icon: <WaterDropIcon /> },
 *   // Additional metrics...
 * ];
 * 
 * <MetricCardsContainer metrics={metrics} />
 * ```
 * 
 * @example
 * ```tsx
 * // With fluid grid layout
 * <MetricCardsContainer metrics={metrics} useFluidGrid={true} />
 * ```
 */
export const MetricCardsContainer: React.FC<MetricCardsContainerProps> = ({
  metrics,
  className,
  useFluidGrid = false,
}) => {
  const getGridSpacing = (): number => {
    return 1; // 8px consistent across all screen sizes to match reference
  };

  // Render with fluid grid if specified, otherwise use Material UI Grid
  if (useFluidGrid) {
    return (
      <StyledContainer className={className}>
        <StyledFluidGrid>
          {metrics.map((metric, index) => (
            <MetricCard
              key={`metric-${index}`}
              title={metric.title}
              value={metric.value}
              targetValue={metric.targetValue}
              icon={metric.icon}
            />
          ))}
        </StyledFluidGrid>
      </StyledContainer>
    );
  }
  
  // Default rendering with flexbox horizontal layout
  return (
    <StyledContainer className={className}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        gap: getGridSpacing(),
        width: '100%',
        [theme => theme.breakpoints.down('sm')]: {
          flexDirection: 'column'
        }
      }}>
        {metrics.map((metric, index) => (
          <Box key={`metric-${index}`} sx={{ 
            flex: '1 1 auto',
            minWidth: '140px',
            [theme => theme.breakpoints.down('sm')]: {
              flex: '1 1 100%',
              minWidth: 'unset'
            }
          }}>
            <MetricCard
              sx={{backgroundColor: index > 2 ? '#ffffff': undefined}}
              title={metric.title}
              value={metric.value}
              targetValue={metric.targetValue}
              icon={metric.icon}
            />
          </Box>
        ))}
      </Box>
    </StyledContainer>
  );
};

export default MetricCardsContainer;