import type { Meta, StoryObj } from '@storybook/react';
import NotificationRow from '../../shared/components/ui/NotificationRow';

const meta = {
  title: 'UI/NotificationRow',
  component: NotificationRow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NotificationRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Environment mode switched to Auto',
    timestamp: 'April 10, 2025 – 10:00PM',
    authorName: 'Markus Johnson',
  },
};

export const WithCustomAvatar: Story = {
  args: {
    message: 'Environment mode switched to Manual',
    timestamp: 'April 12, 2025 – 11:30AM',
    authorName: 'Sarah Thompson',
    avatarUrl: 'https://i.pravatar.cc/100?img=5',
  },
};

export const LongMessage: Story = {
  args: {
    message: 'Humidity levels adjusted automatically due to detected environmental changes in zone 3',
    timestamp: 'April 15, 2025 – 3:45PM',
    authorName: 'Alex Rodriguez',
  },
};