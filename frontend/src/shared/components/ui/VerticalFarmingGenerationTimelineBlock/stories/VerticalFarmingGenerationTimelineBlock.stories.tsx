import { Meta, StoryObj } from '@storybook/react';
import { VerticalFarmingGenerationTimelineBlock } from '../VerticalFarmingGenerationTimelineBlock';

const meta = {
  title: 'Shared/Components/VerticalFarmingGenerationTimelineBlock',
  component: VerticalFarmingGenerationTimelineBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof VerticalFarmingGenerationTimelineBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: Array(16).fill(0), // 16 bars as shown in the design
    startDateLabel: '01 Apr',
    endDateLabel: '15 Apr',
    tooltipDate: 'April 4',
    selectedBarIndices: [3, 4, 14], // Highlight specific bars as in the design
  },
};

export const WithoutTooltip: Story = {
  args: {
    data: Array(16).fill(0),
    startDateLabel: '01 Apr',
    endDateLabel: '15 Apr',
    selectedBarIndices: [3, 4, 14],
  },
};

export const DifferentDates: Story = {
  args: {
    data: Array(16).fill(0),
    startDateLabel: '15 May',
    endDateLabel: '30 May',
    tooltipDate: 'May 20',
    selectedBarIndices: [5, 6, 7],
  },
};
