import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { DrawerHeaderContainer } from '../../shared/components/ui/Container/DrawerHeaderContainer';

const meta = {
  title: 'Container/DrawerHeaderContainer',
  component: DrawerHeaderContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ width: '400px', border: '1px dashed #ccc' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof DrawerHeaderContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Create New Container',
    onClose: () => console.log('Close clicked'),
  },
};

export const WithoutDivider: Story = {
  args: {
    title: 'Create New Container',
    onClose: () => console.log('Close clicked'),
    withDivider: false,
  },
};

export const LongTitle: Story = {
  args: {
    title: 'This is a very long drawer title that might wrap to multiple lines',
    onClose: () => console.log('Close clicked'),
  },
};
