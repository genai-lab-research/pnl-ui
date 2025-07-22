import { Meta, StoryObj } from '@storybook/react';
import { VerticalFarmingGenerationBlock } from '../VerticalFarmingGenerationBlock';

const meta = {
  title: 'Shared/Components/VerticalFarmingGenerationBlock-Area',
  component: VerticalFarmingGenerationBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof VerticalFarmingGenerationBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    areaLabel: 'Area',
    areaUnit: 'm²',
    leftValue: '0.0',
    rightValue: '0.0012',
    alertValue: '0.0004',
    graphData: [0.0002, 0.0003, 0.0004, 0.0006, 0.0008, 0.0010, 0.0012],
  },
};

export const WithoutAlert: Story = {
  args: {
    areaLabel: 'Area',
    areaUnit: 'm²',
    leftValue: '0.0',
    rightValue: '0.0012',
    graphData: [0.0002, 0.0003, 0.0004, 0.0006, 0.0008, 0.0010, 0.0012],
  },
};

export const DifferentValues: Story = {
  args: {
    areaLabel: 'Zone',
    areaUnit: 'km²',
    leftValue: '1.2',
    rightValue: '3.4',
    alertValue: '2.5',
    graphData: [1.2, 1.5, 1.8, 2.2, 2.7, 3.1, 3.4],
  },
};