import React from 'react';
import { ContainerStatusHeader } from './ContainerStatusHeader';
import { Box, Stack } from '@mui/material';
import { AgriculturalEquipmentOutlined, LocalShippingOutlined } from '@mui/icons-material';

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
            containerDescription="Vertical farming container for leafy greens production"
            status="Active"
            statusVariant="active"
          />
        </Box>

        {/* Container with Warning Status */}
        <Box>
          <h3>Container with Warning</h3>
          <ContainerStatusHeader
            containerName="Container-002"
            containerDescription="Hydroponic growing system - Temperature alert"
            status="Warning"
            statusVariant="warning"
          />
        </Box>

        {/* Container with Error Status */}
        <Box>
          <h3>Container with Error</h3>
          <ContainerStatusHeader
            containerName="Container-003"
            containerDescription="Aeroponic tower system - Offline"
            status="Error"
            statusVariant="error"
          />
        </Box>

        {/* Container with Inactive Status */}
        <Box>
          <h3>Inactive Container</h3>
          <ContainerStatusHeader
            containerName="Container-004"
            containerDescription="Maintenance container - Temporarily offline"
            status="Inactive"
            statusVariant="inactive"
          />
        </Box>

        {/* Container with Custom Icon */}
        <Box>
          <h3>Container with Custom Icon</h3>
          <ContainerStatusHeader
            containerName="Container-005"
            containerDescription="Specialty agricultural equipment container"
            status="Active"
            statusVariant="active"
            customIcon={<AgriculturalEquipmentOutlined />}
          />
        </Box>

        {/* Different Sizes */}
        <Box>
          <h3>Different Sizes</h3>
          <Stack spacing={2}>
            <ContainerStatusHeader
              containerName="Small Container"
              containerDescription="Compact container display"
              status="Active"
              statusVariant="active"
              size="sm"
            />
            <ContainerStatusHeader
              containerName="Medium Container"
              containerDescription="Standard container display"
              status="Active"
              statusVariant="active"
              size="md"
            />
            <ContainerStatusHeader
              containerName="Large Container"
              containerDescription="Large container display for emphasis"
              status="Active"
              statusVariant="active"
              size="lg"
            />
          </Stack>
        </Box>

        {/* Loading State */}
        <Box>
          <h3>Loading State</h3>
          <ContainerStatusHeader
            containerName="Loading Container"
            containerDescription="Container data is loading..."
            loading={true}
          />
        </Box>

        {/* Error State */}
        <Box>
          <h3>Error State</h3>
          <ContainerStatusHeader
            containerName="Error Container"
            containerDescription="Failed to load container data"
            error="Failed to load container information. Please try again."
          />
        </Box>

        {/* Clickable Container */}
        <Box>
          <h3>Clickable Container</h3>
          <ContainerStatusHeader
            containerName="Interactive Container"
            containerDescription="Click to view container details"
            status="Active"
            statusVariant="active"
            onClick={() => alert('Container clicked!')}
          />
        </Box>

        {/* Container without Icon */}
        <Box>
          <h3>Container without Icon</h3>
          <ContainerStatusHeader
            containerName="Text-only Container"
            containerDescription="Container display without icon"
            status="Active"
            statusVariant="active"
            showIcon={false}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default ContainerStatusHeaderExamples;
