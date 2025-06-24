import { Meta, StoryObj } from '@storybook/react';
import { VerticalFarmingGenerationBlock } from '../../shared/components/ui/VerticalFarmingGenerationBlock';
import { generateGrowthMatrix } from '../../shared/components/ui/VerticalFarmingGenerationBlock/utils';

const meta = {
  title: 'UI Components/VerticalFarmingGenerationBlock',
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
    slotNumber: 4,
    trayId: 'TR-15199256',
    progressPercentage: 75,
    gridSize: '10×20 Grid',
    cropCount: 170,
    growthStatusMatrix: generateGrowthMatrix(12, 21, 75),
  },
};

export const LowProgress: Story = {
  args: {
    slotNumber: 2,
    trayId: 'TR-98765432',
    progressPercentage: 25,
    gridSize: '10×20 Grid',
    cropCount: 170,
    growthStatusMatrix: generateGrowthMatrix(12, 21, 25),
  },
};

export const HighProgress: Story = {
  args: {
    slotNumber: 6,
    trayId: 'TR-45678901',
    progressPercentage: 95,
    gridSize: '10×20 Grid',
    cropCount: 170,
    growthStatusMatrix: generateGrowthMatrix(12, 21, 95),
  },
};