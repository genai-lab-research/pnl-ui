import type { Meta, StoryObj } from '@storybook/react';
import { SettingsGroupContainer } from '../../shared/components/ui/Container/SettingsGroupContainer';
import { Box, FormControlLabel, Switch, FormGroup, Checkbox, Typography } from '@mui/material';

const meta = {
  title: 'Container/SettingsGroupContainer',
  component: SettingsGroupContainer,
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
} satisfies Meta<typeof SettingsGroupContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Settings',
    children: (
      <FormGroup>
        <FormControlLabel 
          control={<Switch color="primary" />} 
          label="Enable Shadow Service" 
        />
      </FormGroup>
    ),
  },
};

export const WithoutDivider: Story = {
  args: {
    title: 'Settings',
    withDivider: false,
    children: (
      <FormGroup>
        <FormControlLabel 
          control={<Switch color="primary" />} 
          label="Enable Shadow Service" 
        />
      </FormGroup>
    ),
  },
};

export const WithMultipleOptions: Story = {
  args: {
    title: 'System Settings',
    children: (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <FormControlLabel 
          control={<Switch color="primary" />} 
          label="Enable Shadow Service" 
        />
        <FormControlLabel 
          control={<Switch color="primary" />} 
          label="Auto-sync with cloud" 
        />
        <FormControlLabel 
          control={<Switch color="primary" />} 
          label="Daily performance reports" 
        />
      </Box>
    ),
  },
};

export const WithCheckboxes: Story = {
  args: {
    title: 'System Integration',
    children: (
      <Box>
        <FormControlLabel 
          control={<Checkbox color="primary" />} 
          label={
            <Box>
              <Typography variant="body2">Connect to other systems after creation</Typography>
            </Box>
          } 
        />
      </Box>
    ),
  },
};