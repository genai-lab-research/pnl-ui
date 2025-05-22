import type { Meta, StoryObj } from '@storybook/react';
import { HeaderContainer } from '../../shared/components/ui/Container';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const meta = {
  title: 'Container/HeaderContainer',
  component: HeaderContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeaderContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Control Panel',
  },
};

export const WithAvatar: Story = {
  args: {
    title: 'Control Panel',
    avatarUrl: 'https://i.pravatar.cc/300',
    userName: 'Jane Doe',
  },
};

export const WithActions: Story = {
  args: {
    title: 'Control Panel',
    children: (
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        size="small"
      >
        Add Container
      </Button>
    ),
  },
};

export const Complete: Story = {
  args: {
    title: 'Control Panel',
    avatarUrl: 'https://i.pravatar.cc/300',
    userName: 'Jane Doe',
    children: (
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        size="small"
      >
        Add Container
      </Button>
    ),
  },
};

export const WithoutDivider: Story = {
  args: {
    title: 'Control Panel',
    withDivider: false,
  },
};