import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { ContainerOverviewInfo } from '../../shared/components/ui/Container/ContainerOverviewInfo';
import { Box, Typography } from '@mui/material';

const meta: Meta<typeof ContainerOverviewInfo> = {
  title: 'Container/ContainerOverviewInfo',
  component: ContainerOverviewInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ContainerOverviewInfo>;

export const Default: Story = {
  args: {
    children: (
      <Box>
        <Typography variant="h6" className="mb-4">Container Metrics</Typography>
        <Box className="grid grid-cols-3 gap-4">
          <Box className="bg-gray-50 p-4 rounded">
            <Typography variant="subtitle2">Air Temperature</Typography>
            <Typography variant="h5">20°C</Typography>
          </Box>
          <Box className="bg-gray-50 p-4 rounded">
            <Typography variant="subtitle2">Rel. Humidity</Typography>
            <Typography variant="h5">65%</Typography>
          </Box>
          <Box className="bg-gray-50 p-4 rounded">
            <Typography variant="subtitle2">CO₂ Level</Typography>
            <Typography variant="h5">860 ppm</Typography>
          </Box>
        </Box>
      </Box>
    ),
  },
};

export const WithMultipleSections: Story = {
  args: {
    children: (
      <Box className="space-y-6">
        <Box>
          <Typography variant="h6" className="mb-4">Container Metrics</Typography>
          <Box className="grid grid-cols-3 gap-4">
            <Box className="bg-gray-50 p-4 rounded">
              <Typography variant="subtitle2">Air Temperature</Typography>
              <Typography variant="h5">20°C</Typography>
            </Box>
            <Box className="bg-gray-50 p-4 rounded">
              <Typography variant="subtitle2">Rel. Humidity</Typography>
              <Typography variant="h5">65%</Typography>
            </Box>
            <Box className="bg-gray-50 p-4 rounded">
              <Typography variant="subtitle2">CO₂ Level</Typography>
              <Typography variant="h5">860 ppm</Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Typography variant="h6" className="mb-4">Crops</Typography>
          <Box className="bg-gray-50 p-4 rounded">
            <Typography>Crop information goes here</Typography>
          </Box>
        </Box>
      </Box>
    ),
  },
};