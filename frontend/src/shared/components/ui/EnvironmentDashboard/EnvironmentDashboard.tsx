import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { TrayChart } from '../TrayChart';

export interface EnvironmentDashboardProps {
  /**
   * Optional CSS class name for additional styling
   */
  className?: string;
  /**
   * Optional width of the component
   */
  width?: number | string;
  /**
   * Optional height of the component
   */
  height?: number | string;
  /**
   * Data for Area chart (m²)
   */
  areaData?: Array<[number, number]>;
  /**
   * Data for Light chart (h, accum)
   */
  lightData?: Array<[number, number]>;
  /**
   * Data for Water chart (h, accum)
   */
  waterData?: Array<[number, number]>;
  /**
   * Data for Air temperature chart (°C)
   */
  airTempData?: Array<[number, number]>;
  /**
   * Data for Humidity chart (% RH)
   */
  humidityData?: Array<[number, number]>;
  /**
   * Data for CO₂ chart (ppm)
   */
  co2Data?: Array<[number, number]>;
  /**
   * Data for Water temperature chart (°C)
   */
  waterTempData?: Array<[number, number]>;
  /**
   * Data for pH chart
   */
  phData?: Array<[number, number]>;
  /**
   * Data for EC chart (% mS/cm)
   */
  ecData?: Array<[number, number]>;
}

/**
 * EnvironmentDashboard component displays multiple tray charts for monitoring various environmental metrics
 * in a vertical farming control panel. It organizes multiple TrayChart components in a grid layout with a title header.
 *
 * The component shows environmental data including area, light, water, air temperature, humidity, CO₂,
 * water temperature, pH, and electrical conductivity (EC) measurements.
 *
 * @component
 * @example
 * ```tsx
 * <EnvironmentDashboard 
 *   areaData={areaData}
 *   lightData={lightData}
 *   waterData={waterData}
 *   airTempData={airTempData}
 *   humidityData={humidityData}
 *   co2Data={co2Data}
 *   waterTempData={waterTempData}
 *   phData={phData}
 *   ecData={ecData}
 * />
 * ```
 */
export const EnvironmentDashboard: React.FC<EnvironmentDashboardProps> = ({
  className,
  width = '100%',
  height = 'auto',
  areaData = [[0, 0], [50, 0.0006], [100, 0.0009], [150, 0.0010], [200, 0.0011], [250, 0.0012]],
  lightData = [[0, 0], [50, 40], [100, 80], [150, 120], [200, 160], [250, 220], [270, 270]],
  waterData = [[0, 0], [50, 5], [100, 10], [150, 15], [200, 20], [250, 25], [270, 29]],
  airTempData = [[0, 21.0], [50, 21.1], [100, 21.1], [150, 21.0], [200, 21.2], [250, 21.1], [270, 21.2]],
  humidityData = [[0, 65], [50, 67], [100, 68], [150, 69], [200, 69], [250, 70], [270, 70.1]],
  co2Data = [[0, 900], [50, 897], [100, 899], [150, 900], [200, 896], [250, 898], [270, 897]],
  waterTempData = [[0, 21.0], [50, 21.0], [100, 21.1], [150, 21.0], [200, 21.1], [250, 21.0], [270, 21.1]],
  phData = [[0, 6.5], [50, 6.4], [100, 6.3], [150, 6.3], [200, 6.3], [250, 6.3], [270, 6.3]],
  ecData = [[0, 1.8], [50, 1.8], [100, 1.9], [150, 1.8], [200, 1.9], [250, 1.8], [270, 1.9]],
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        width: width,
        height: height,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 1,
        overflow: 'hidden',
      }}
      className={className}
    >
      {/* Header */}
      <Typography 
        variant="subtitle2"
        component="h2"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: '12px',
          fontWeight: 500,
          lineHeight: '20px',
          color: theme.palette.text.primary,
          textAlign: 'center',
        }}
      >
        Environment
      </Typography>

      {/* Tray Charts Grid */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TrayChart 
          title="Area" 
          subtitle="m²" 
          data={areaData} 
          width="100%" 
          height={40}
          xStart={0}
          xEnd={areaData[areaData.length - 1][0]}
        />
        <TrayChart 
          title="Light" 
          subtitle="h, accum" 
          data={lightData} 
          width="100%" 
          height={40}
          xStart={0}
          xEnd={lightData[lightData.length - 1][0]}
        />
        <TrayChart 
          title="Water" 
          subtitle="h, accum" 
          data={waterData} 
          width="100%" 
          height={40}
          xStart={0}
          xEnd={waterData[waterData.length - 1][0]}
        />
        <TrayChart 
          title="Air, t" 
          subtitle="°C" 
          data={airTempData} 
          width="100%" 
          height={40}
          xStart={0}
          xEnd={airTempData[airTempData.length - 1][0]}
        />
        <TrayChart 
          title="Humidity" 
          subtitle="% RH" 
          data={humidityData} 
          width="100%" 
          height={40}
          xStart={0}
          xEnd={humidityData[humidityData.length - 1][0]}
        />
        <TrayChart 
          title="CO₂" 
          subtitle="ppm" 
          data={co2Data} 
          width="100%" 
          height={40}
          xStart={0}
          xEnd={co2Data[co2Data.length - 1][0]}
        />
        <TrayChart 
          title="Water, t" 
          subtitle="°C" 
          data={waterTempData} 
          width="100%" 
          height={40}
          xStart={0}
          xEnd={waterTempData[waterTempData.length - 1][0]}
        />
        <TrayChart 
          title="pH" 
          subtitle="" 
          data={phData} 
          width="100%" 
          height={40}
          xStart={0}
          xEnd={phData[phData.length - 1][0]}
        />
        <TrayChart 
          title="EC" 
          subtitle="% mS/cm" 
          data={ecData} 
          width="100%" 
          height={40}
          xStart={0}
          xEnd={ecData[ecData.length - 1][0]}
        />
      </Box>
    </Paper>
  );
};

export default EnvironmentDashboard;