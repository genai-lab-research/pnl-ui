import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { ContainerMedium } from '../../shared/components/ui/Container/ContainerMedium';
import { Box, Typography } from '@mui/material';

const meta: Meta<typeof ContainerMedium> = {
  title: 'Container/ContainerMedium',
  component: ContainerMedium,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ContainerMedium>;

export const Default: Story = {
  args: {
    children: (
      <Box>
        <Typography variant="subtitle1" className="font-medium">Air Temperature</Typography>
        <Typography variant="h4">20°C</Typography>
        <Typography variant="caption" className="text-gray-500">/ 21°C</Typography>
      </Box>
    ),
  },
};

export const WithNoPadding: Story = {
  args: {
    noPadding: true,
    children: (
      <Box className="p-0">
        <div className="bg-gray-100 p-3">
          <Typography variant="subtitle2">Header</Typography>
        </div>
        <div className="p-4">
          <Typography variant="body1">
            This container has no internal padding, allowing you to create your own sections with different background colors.
          </Typography>
        </div>
      </Box>
    ),
  },
};

export const WithLongerContent: Story = {
  args: {
    children: (
      <Box>
        <Typography variant="subtitle1" className="font-medium mb-2">Container Information</Typography>
        <Box className="space-y-2">
          <Box className="flex justify-between">
            <Typography variant="body2" className="text-gray-500">Name:</Typography>
            <Typography variant="body2">farm-container-04</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="body2" className="text-gray-500">Type:</Typography>
            <Typography variant="body2">Physical</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="body2" className="text-gray-500">Tenant:</Typography>
            <Typography variant="body2">tenant-123</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="body2" className="text-gray-500">Purpose:</Typography>
            <Typography variant="body2">Development</Typography>
          </Box>
        </Box>
      </Box>
    ),
  },
};