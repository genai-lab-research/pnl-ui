import type { Meta, StoryObj } from '@storybook/react';
import ControlPanelHeader from '../../shared/components/ui/ControlPanelHeader';

const meta = {
  title: 'UI/ControlPanelHeader',
  component: ControlPanelHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ControlPanelHeader>;

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
    avatarSrc: 'https://i.pravatar.cc/300',
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Dashboard',
  },
};
