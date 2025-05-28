import { Box, Button, Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { DrawerContainer } from '../../shared/components/ui/Container/DrawerContainer';
import { DrawerHeaderContainer } from '../../shared/components/ui/Container/DrawerHeaderContainer';

const meta = {
  title: 'Container/DrawerContainer',
  component: DrawerContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', width: '400px', border: '1px dashed #ccc' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof DrawerContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Drawer Content</Typography>
        <Typography sx={{ mt: 2 }}>This is the content of the drawer container.</Typography>
      </Box>
    ),
  },
};

export const WithHeader: Story = {
  args: {
    children: (
      <>
        <DrawerHeaderContainer title="Drawer Title" onClose={() => console.log('Close clicked')} />
        <Box sx={{ p: 3 }}>
          <Typography>This is the content below the drawer header.</Typography>
        </Box>
      </>
    ),
  },
};

export const Complete: Story = {
  args: {
    children: (
      <>
        <DrawerHeaderContainer
          title="Create New Container"
          onClose={() => console.log('Close clicked')}
        />
        <Box
          sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3, flex: 1, overflow: 'auto' }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            Container Information
          </Typography>

          {/* Form content would go here */}
          <Box sx={{ height: '400px', bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
            <Typography>Form fields would go here</Typography>
          </Box>

          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" fullWidth>
              Create Container
            </Button>
          </Box>
        </Box>
      </>
    ),
  },
};
