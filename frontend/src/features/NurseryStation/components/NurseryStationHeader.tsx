import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { BreadcrumbLink } from '../../../shared/components/BreadcrumbLink';
import ContainerInfo from '../../../shared/components/ui/ContainerInfo';
import { UtilizationIndicator } from '../../../shared/components/ui/UtilizationIndicator';

interface NurseryStationHeaderProps {
  containerId: number;
  containerName?: string;
  containerType?: string;
  tenant?: string;
  location?: string;
  utilizationPercentage?: number;
}

/**
 * Header component for the Nursery Station page
 * Displays breadcrumb navigation, container information, and utilization summary
 */
export const NurseryStationHeader: React.FC<NurseryStationHeaderProps> = ({
  containerName = 'Container',
  containerType = 'Growing Container',
  tenant = 'Default Tenant',
  location = 'Unknown Location',
  utilizationPercentage = 0
}) => {
  return (
    <Box className="space-y-6 mb-6">
      {/* Breadcrumb Navigation */}
      <BreadcrumbLink
        path="Container Management Dashboard"
        onClick={() => window.location.href = '/containers'}
      />

      {/* Container Information */}
      <Paper className="p-4 bg-white rounded-lg shadow-sm">
        <ContainerInfo
          name={containerName}
          type={containerType}
          tenant={tenant}
          location={location}
          purpose="Growing"
          status="Active"
          created="2024-01-01"
          lastModified="2024-01-01"
          creator="System"
          seedTypes="Mixed"
          notes="Nursery station container"
        />
      </Paper>

      {/* Nursery Station Title and Utilization */}
      <Box className="flex items-center justify-between">
        <Typography variant="h4" className="font-bold text-steel-smoke">
          Nursery Station
        </Typography>
        
        <Paper className="p-4 bg-white rounded-lg shadow-sm">
          <Box className="flex items-center space-x-4">
            <Typography variant="h6" className="text-steel-smoke">
              Total Utilization
            </Typography>
            <UtilizationIndicator
              percentage={utilizationPercentage}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};