import type { Meta, StoryObj } from '@storybook/react';
import { NewContainerInfoContainer } from '../../shared/components/ui/Container/NewContainerInfoContainer';
import { Box, TextField, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';

const meta = {
  title: 'Container/NewContainerInfoContainer',
  component: NewContainerInfoContainer,
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
} satisfies Meta<typeof NewContainerInfoContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Container Information',
    children: (
      <>
        <TextField
          fullWidth
          label="Container Name"
          placeholder="Enter container name"
          variant="outlined"
          size="small"
        />
        <TextField
          select
          fullWidth
          label="Tenant"
          defaultValue=""
          variant="outlined"
          size="small"
        >
          <MenuItem value="tenant-001">tenant-001</MenuItem>
          <MenuItem value="tenant-002">tenant-002</MenuItem>
        </TextField>
      </>
    ),
  },
};

export const WithToggleButtons: Story = {
  args: {
    title: 'Container Type',
    children: (
      <ToggleButtonGroup
        value="physical"
        exclusive
        fullWidth
        size="small"
        sx={{ 
          '& .MuiToggleButton-root': {
            textTransform: 'none',
            py: 0.75,
          }
        }}
      >
        <ToggleButton value="physical">
          Physical
        </ToggleButton>
        <ToggleButton value="virtual">
          Virtual
        </ToggleButton>
      </ToggleButtonGroup>
    ),
  },
};

export const WithMultipleFields: Story = {
  args: {
    title: 'Container Information',
    children: (
      <>
        <TextField
          fullWidth
          label="Container Name"
          placeholder="farm-container-04"
          variant="outlined"
          size="small"
        />
        <TextField
          select
          fullWidth
          label="Tenant"
          defaultValue="tenant-001"
          variant="outlined"
          size="small"
        >
          <MenuItem value="tenant-001">tenant-001</MenuItem>
          <MenuItem value="tenant-002">tenant-002</MenuItem>
        </TextField>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Container Type
          </Typography>
          <ToggleButtonGroup
            value="physical"
            exclusive
            fullWidth
            size="small"
            sx={{ 
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                py: 0.75,
              }
            }}
          >
            <ToggleButton value="physical">
              Physical
            </ToggleButton>
            <ToggleButton value="virtual">
              Virtual
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </>
    ),
  },
};