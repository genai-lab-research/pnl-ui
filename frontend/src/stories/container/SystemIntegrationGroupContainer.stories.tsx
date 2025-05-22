import type { Meta, StoryObj } from '@storybook/react';
import { SystemIntegrationGroupContainer } from '../../shared/components/ui/Container/SystemIntegrationGroupContainer';
import { Box, FormControlLabel, Checkbox, Typography } from '@mui/material';

const meta = {
  title: 'Container/SystemIntegrationGroupContainer',
  component: SystemIntegrationGroupContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ width: '400px', p: 2, bgcolor: '#fff' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof SystemIntegrationGroupContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'System Integration',
    children: (
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label="Connect to other systems after creation"
      />
    ),
  },
};

export const WithDescription: Story = {
  args: {
    title: 'System Integration',
    description: 'Configure how this container interacts with external systems and services',
    children: (
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label="Connect to other systems after creation"
      />
    ),
  },
};

export const WithMultipleOptions: Story = {
  args: {
    title: 'System Integration',
    description: 'Configure how this container interacts with external systems and services',
    children: (
      <>
        <FormControlLabel
          control={<Checkbox color="primary" />}
          label="Connect to other systems after creation"
        />
        <FormControlLabel
          control={<Checkbox color="primary" />}
          label="Enable API access"
        />
        <FormControlLabel
          control={<Checkbox color="primary" defaultChecked />}
          label="Include in monitoring dashboard"
        />
      </>
    ),
  },
};

export const WithLabelHelperText: Story = {
  args: {
    title: 'System Integration',
    children: (
      <>
        <FormControlLabel
          control={<Checkbox color="primary" />}
          label={
            <Box>
              <Typography variant="body2">Connect to other systems after creation</Typography>
              <Typography variant="caption" color="text.secondary">
                Allows automatic connection to approved third-party systems
              </Typography>
            </Box>
          }
        />
        <FormControlLabel
          control={<Checkbox color="primary" />}
          label={
            <Box>
              <Typography variant="body2">Enable data sharing</Typography>
              <Typography variant="caption" color="text.secondary">
                Share container metrics with approved partners
              </Typography>
            </Box>
          }
        />
      </>
    ),
  },
};