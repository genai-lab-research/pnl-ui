import { Meta, StoryObj } from '@storybook/react';
import { GenerationBlock } from '../GenerationBlock';

const meta = {
  title: 'Shared/Components/UI/GenerationBlock',
  component: GenerationBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GenerationBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    slotNumber: 4,
    trayId: 'TR-15199256',
    progressPercentage: 75,
    gridRows: 20,
    gridColumns: 10,
    totalCrops: 170,
  },
};

export const HighProgress: Story = {
  args: {
    slotNumber: 1,
    trayId: 'TR-15199256',
    progressPercentage: 95,
    gridRows: 20,
    gridColumns: 10,
    totalCrops: 190,
  },
};

export const LowProgress: Story = {
  args: {
    slotNumber: 2,
    trayId: 'TR-15199256',
    progressPercentage: 25,
    gridRows: 20,
    gridColumns: 10,
    totalCrops: 50,
  },
};