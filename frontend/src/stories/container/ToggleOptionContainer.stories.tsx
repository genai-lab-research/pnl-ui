import type { Meta, StoryObj } from '@storybook/react';
import { ToggleOptionContainer } from '../../shared/components/ui/Container/ToggleOptionContainer';
import { Box } from '@mui/material';

const meta = {
  title: 'Container/ToggleOptionContainer',
  component: ToggleOptionContainer,
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
} satisfies Meta<typeof ToggleOptionContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Enable Shadow Service',
    checked: false,
    onChange: (checked) => console.log('Toggle changed:', checked),
  },
};

export const Checked: Story = {
  args: {
    label: 'Enable Shadow Service',
    checked: true,
    onChange: (checked) => console.log('Toggle changed:', checked),
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Auto-sync with cloud',
    description: 'Automatically synchronize container data with cloud services for backup and remote monitoring',
    checked: true,
    onChange: (checked) => console.log('Toggle changed:', checked),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Enable Shadow Service',
    description: 'This option is currently unavailable due to system maintenance',
    checked: false,
    disabled: true,
    onChange: (checked) => console.log('Toggle changed:', checked),
  },
};