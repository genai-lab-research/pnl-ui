import React from 'react';
import { ContainerStatusHeader } from './ContainerStatusHeader';
import { Box, Stack } from '@mui/material';

/**
 * ContainerStatusHeader Usage Examples
 * 
 * This file demonstrates different ways to use the ContainerStatusHeader component
 * in various scenarios within the Container Detail feature.
 */
export const ContainerStatusHeaderExamples: React.FC = () => {
  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
      <Stack spacing={3}>
        {/* Basic Usage - Container with Active Status */}
        <Box>
          <h3>Basic Active Container</h3>
          <ContainerStatusHeader
            containerName="Container-001"
            containerType="physical"
            tenantName="Green Farm LLC"
            status="Active"
            statusVariant="active"
          />
        </Box>

        {/* Container with Maintenance Status */}
        <Box>
          <h3>Container with Maintenance</h3>
          <ContainerStatusHeader
            containerName="Container-002"
            containerType="virtual"
            tenantName="Hydro Systems Inc"
            status="Maintenance"
            statusVariant="maintenance"
          />
        </Box>

        {/* Container with Error Status */}
        <Box>
          <h3>Container with Error</h3>
          <ContainerStatusHeader
            containerName="Container-003"
            containerType="physical"
            tenantName="Aeroponic Systems"
            status="Error"
            statusVariant="error"
          />
        </Box>

        {/* Container with Inactive Status */}
        <Box>
          <h3>Inactive Container</h3>
          <ContainerStatusHeader
            containerName="Container-004"
            containerType="virtual"
            tenantName="Maintenance Corp"
            status="Inactive"
            statusVariant="inactive"
          />
        </Box>

        {/* Container without Tenant */}
        <Box>
          <h3>Container without Tenant</h3>
          <ContainerStatusHeader
            containerName="Container-005"
            containerType="physical"
            status="Active"
            statusVariant="active"
          />
        </Box>

        {/* Different Container Types */}
        <Box>
          <h3>Different Container Types</h3>
          <Stack spacing={2}>
            <ContainerStatusHeader
              containerName="Physical Container"
              containerType="physical"
              tenantName="Farm Tech Ltd"
              status="Active"
              statusVariant="active"
            />
            <ContainerStatusHeader
              containerName="Virtual Container"
              containerType="virtual"
              tenantName="Cloud Farms"
              status="Active"
              statusVariant="active"
            />
          </Stack>
        </Box>

        {/* Loading State */}
        <Box>
          <h3>Loading State</h3>
          <ContainerStatusHeader
            containerName="Loading Container"
            loading={true}
          />
        </Box>

        {/* Various Status Examples */}
        <Box>
          <h3>Various Status Examples</h3>
          <Stack spacing={2}>
            <ContainerStatusHeader
              containerName="Created Container"
              containerType="physical"
              tenantName="New Tenant"
              status="Created"
              statusVariant="inactive"
            />
            <ContainerStatusHeader
              containerName="Maintenance Container"
              containerType="virtual"
              tenantName="Service Corp"
              status="Under Maintenance"
              statusVariant="maintenance"
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ContainerStatusHeaderExamples;
