import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { ContainerSmall } from '../../shared/components/ui/Container/ContainerSmall';
import { Box, Typography } from '@mui/material';

const meta: Meta<typeof ContainerSmall> = {
  title: 'Container/ContainerSmall',
  component: ContainerSmall,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ContainerSmall>;

export const Default: Story = {
  args: {
    children: (
      <Box className="flex items-center justify-center">
        <Typography variant="body2" className="text-center">Small Container</Typography>
      </Box>
    ),
  },
};

export const WithLabel: Story = {
  args: {
    children: (
      <Box>
        <Typography variant="caption" className="text-gray-500">Label</Typography>
        <Typography variant="body1" className="font-medium">Value</Typography>
      </Box>
    ),
  },
};

export const WithNoPadding: Story = {
  args: {
    noPadding: true,
    children: (
      <Box className="p-0">
        <div className="bg-gray-100 p-2">
          <Typography variant="subtitle2">Header</Typography>
        </div>
        <div className="p-3">
          <Typography variant="body2">
            Content in a no-padding container.
          </Typography>
        </div>
      </Box>
    ),
  },
};

export const GroupedContainers: Story = {
  render: () => (
    <Box className="flex space-x-2">
      <ContainerSmall>
        <Typography variant="caption" className="text-gray-500">Temperature</Typography>
        <Typography variant="body1" className="font-medium">24°C</Typography>
      </ContainerSmall>
      <ContainerSmall>
        <Typography variant="caption" className="text-gray-500">Humidity</Typography>
        <Typography variant="body1" className="font-medium">65%</Typography>
      </ContainerSmall>
      <ContainerSmall>
        <Typography variant="caption" className="text-gray-500">Air Quality</Typography>
        <Typography variant="body1" className="font-medium">Good</Typography>
      </ContainerSmall>
    </Box>
  ),
};