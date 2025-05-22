import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { ContainerLarge } from '../../shared/components/ui/Container/ContainerLarge';
import { Box, Typography, Button } from '@mui/material';

const meta: Meta<typeof ContainerLarge> = {
  title: 'Container/ContainerLarge',
  component: ContainerLarge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ContainerLarge>;

export const Default: Story = {
  args: {
    children: (
      <Box>
        <Typography variant="body1">
          This is a large container that can be used for main content sections.
          It provides more space and prominence compared to the medium container.
        </Typography>
      </Box>
    ),
  },
};

export const WithTitle: Story = {
  args: {
    title: <Typography variant="h6">Container Information & Settings</Typography>,
    children: (
      <Box className="divide-y divide-gray-200">
        <Box className="pb-4">
          <Typography variant="subtitle1" className="font-medium mb-4">Container Information</Typography>
          <Box className="grid grid-cols-2 gap-4">
            <Box>
              <Typography variant="body2" className="text-gray-500">Name</Typography>
              <Typography variant="body1">farm-container-04</Typography>
            </Box>
            <Box>
              <Typography variant="body2" className="text-gray-500">Type</Typography>
              <Typography variant="body1">Physical</Typography>
            </Box>
            <Box>
              <Typography variant="body2" className="text-gray-500">Tenant</Typography>
              <Typography variant="body1">tenant-123</Typography>
            </Box>
            <Box>
              <Typography variant="body2" className="text-gray-500">Purpose</Typography>
              <Typography variant="body1">Development</Typography>
            </Box>
          </Box>
        </Box>
        <Box className="py-4">
          <Typography variant="subtitle1" className="font-medium mb-4">System Settings</Typography>
          <Typography variant="body1">
            System settings content would go here.
          </Typography>
        </Box>
      </Box>
    ),
  },
};

export const WithTitleAndActions: Story = {
  args: {
    title: <Typography variant="h6">Crops</Typography>,
    actions: (
      <Button variant="contained" color="primary" size="small">
        Add Crop
      </Button>
    ),
    children: (
      <Box>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seed Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cultivation Area</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nursery Table</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last SD</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm">Salanova Cousteau</td>
              <td className="px-4 py-3 text-sm">40</td>
              <td className="px-4 py-3 text-sm">30</td>
              <td className="px-4 py-3 text-sm">2025-01-30</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Kiribati</td>
              <td className="px-4 py-3 text-sm">50</td>
              <td className="px-4 py-3 text-sm">20</td>
              <td className="px-4 py-3 text-sm">2025-01-30</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Rex Butterhead</td>
              <td className="px-4 py-3 text-sm">65</td>
              <td className="px-4 py-3 text-sm">10</td>
              <td className="px-4 py-3 text-sm">2025-01-10</td>
            </tr>
          </tbody>
        </table>
      </Box>
    ),
  },
};