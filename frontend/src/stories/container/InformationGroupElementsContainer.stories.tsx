import { Box, Chip, MenuItem, Stack, TextField, Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { InformationGroupElementsContainer } from '../../shared/components/ui/Container/InformationGroupElementsContainer';

const meta = {
  title: 'Container/InformationGroupElementsContainer',
  component: InformationGroupElementsContainer,
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
} satisfies Meta<typeof InformationGroupElementsContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <TextField
          fullWidth
          label="Container Name"
          placeholder="Enter container name"
          variant="outlined"
          size="small"
        />
        <TextField select fullWidth label="Tenant" defaultValue="" variant="outlined" size="small">
          <MenuItem value="tenant-001">tenant-001</MenuItem>
          <MenuItem value="tenant-002">tenant-002</MenuItem>
        </TextField>
        <TextField select fullWidth label="Purpose" defaultValue="" variant="outlined" size="small">
          <MenuItem value="production">Production</MenuItem>
          <MenuItem value="testing">Testing</MenuItem>
          <MenuItem value="research">Research</MenuItem>
        </TextField>
      </>
    ),
  },
};

export const SmallSpacing: Story = {
  args: {
    spacing: 'small',
    children: (
      <>
        <TextField fullWidth label="Container Name" variant="outlined" size="small" />
        <TextField fullWidth label="Location" variant="outlined" size="small" />
        <TextField fullWidth label="Notes" multiline rows={3} variant="outlined" size="small" />
      </>
    ),
  },
};

export const LargeSpacing: Story = {
  args: {
    spacing: 'large',
    children: (
      <>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Container Details
          </Typography>
          <TextField
            fullWidth
            label="Container ID"
            defaultValue="CONT-2023-045"
            variant="outlined"
            size="small"
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Seed Information
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip label="Someroots" size="small" color="primary" variant="outlined" />
            <Chip label="Sunflower" size="small" color="primary" variant="outlined" />
          </Stack>
          <TextField
            select
            fullWidth
            label="Add seed type"
            defaultValue=""
            variant="outlined"
            size="small"
          >
            <MenuItem value="tomato">Tomato</MenuItem>
            <MenuItem value="lettuce">Lettuce</MenuItem>
          </TextField>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Notes
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Optional notes about this container"
            variant="outlined"
            size="small"
          />
        </Box>
      </>
    ),
  },
};
