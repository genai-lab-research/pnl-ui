import { Box, Chip, MenuItem, Stack, TextField } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { InformationGroupContainer } from '../../shared/components/ui/Container/InformationGroupContainer';

const meta = {
  title: 'Container/InformationGroupContainer',
  component: InformationGroupContainer,
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
} satisfies Meta<typeof InformationGroupContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Basic Information',
    children: (
      <>
        <TextField
          fullWidth
          label="Name"
          defaultValue="Container-A1"
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          label="Location"
          defaultValue="Building 3, Floor 2"
          variant="outlined"
          size="small"
        />
      </>
    ),
  },
};

export const WithChips: Story = {
  args: {
    title: 'Seed Type Variant(s)',
    children: (
      <>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label="Someroots"
            onDelete={() => {}}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Chip
            label="Sunflower"
            onDelete={() => {}}
            color="primary"
            variant="outlined"
            size="small"
          />
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
          <MenuItem value="spinach">Spinach</MenuItem>
        </TextField>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    title: 'System Information',
    elevated: true,
    children: (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">System ID:</Typography>
          <Typography variant="body2" fontWeight="medium">
            SYS-2023-45A
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">Last Updated:</Typography>
          <Typography variant="body2" fontWeight="medium">
            2023-05-15 14:30
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">Status:</Typography>
          <Chip label="Active" color="success" size="small" />
        </Box>
      </>
    ),
  },
};
