import { Meta, StoryObj } from '@storybook/react';
import ContainerStatistics from '../../shared/components/ui/ContainerStatistics';

const meta: Meta<typeof ContainerStatistics> = {
  title: 'Components/ContainerStatistics',
  component: ContainerStatistics,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContainerStatistics>;

export const Default: Story = {
  args: {
    title: 'Physical Containers',
    containerCount: 4,
    yieldData: {
      average: 63,
      total: 81,
      dailyData: [70, 55, 65, 55, 72, 0, 0],
    },
    spaceUtilization: {
      average: 80,
      dailyData: [82, 75, 78, 73, 80, 0, 0],
    },
    dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
};

export const NoWeekendData: Story = {
  args: {
    title: 'Physical Containers',
    containerCount: 4,
    yieldData: {
      average: 63,
      total: 81,
      dailyData: [70, 55, 65, 55, 72, 0, 0],
    },
    spaceUtilization: {
      average: 80,
      dailyData: [82, 75, 78, 73, 80, 0, 0],
    },
  },
};