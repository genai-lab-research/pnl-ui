import type { Meta, StoryObj } from '@storybook/react';
import { PanelBlock } from './PanelBlock';
import { Crop } from '../../../../types/inventory';

const meta = {
  title: 'Components/PanelBlock',
  component: PanelBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PanelBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to create mock crops
const createMockCrop = (id: string, seedType: string, channel: number, overdueDays: number = 0): Crop => ({
  id,
  seed_type: seedType,
  seed_date: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString(),
  transplanting_date_planned: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  harvesting_date_planned: new Date(Date.now() + Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
  transplanted_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  age: Math.floor(Math.random() * 45 + 15),
  status: overdueDays > 0 ? 'overdue' : 'growing',
  overdue_days: overdueDays,
  location: {
    type: 'panel',
    panel_id: 'panel-123',
    row: 0,
    column: 0,
    channel: channel,
    position: Math.floor(Math.random() * 15)
  }
});

// Create mock crops for different channels
const createCropsForPanel = () => {
  const crops: Crop[] = [];
  const seedTypes = ['Lettuce', 'Arugula', 'Spinach', 'Kale', 'Basil'];
  
  // Channel 1: 10 crops
  for (let i = 0; i < 10; i++) {
    const seedType = seedTypes[Math.floor(Math.random() * seedTypes.length)];
    crops.push(createMockCrop(`crop-ch1-${i}`, seedType, 1));
  }
  
  // Channel 2: 8 crops
  for (let i = 0; i < 8; i++) {
    const seedType = seedTypes[Math.floor(Math.random() * seedTypes.length)];
    crops.push(createMockCrop(`crop-ch2-${i}`, seedType, 2));
  }
  
  // Channel 3: 12 crops (some overdue)
  for (let i = 0; i < 12; i++) {
    const seedType = seedTypes[Math.floor(Math.random() * seedTypes.length)];
    const overdueDays = i > 8 ? Math.floor(Math.random() * 5) + 1 : 0;
    crops.push(createMockCrop(`crop-ch3-${i}`, seedType, 3, overdueDays));
  }
  
  // Channel 4: 6 crops
  for (let i = 0; i < 6; i++) {
    const seedType = seedTypes[Math.floor(Math.random() * seedTypes.length)];
    crops.push(createMockCrop(`crop-ch4-${i}`, seedType, 4));
  }
  
  // Channel 5: 9 crops
  for (let i = 0; i < 9; i++) {
    const seedType = seedTypes[Math.floor(Math.random() * seedTypes.length)];
    crops.push(createMockCrop(`crop-ch5-${i}`, seedType, 5));
  }
  
  return crops;
};

export const Default: Story = {
  args: {
    panelId: 'PN-10-662850-5223',
    wallNumber: 1,
    slotNumber: 5,
    utilization: 75,
    cropCount: 45,
    crops: createCropsForPanel(),
  },
};

export const HighUtilization: Story = {
  args: {
    panelId: 'PN-10-662851-5224',
    wallNumber: 2,
    slotNumber: 12,
    utilization: 92,
    cropCount: 69,
    crops: createCropsForPanel(),
  },
};

export const LowUtilization: Story = {
  args: {
    panelId: 'PN-10-662852-5225',
    wallNumber: 3,
    slotNumber: 8,
    utilization: 35,
    cropCount: 26,
    crops: createCropsForPanel().slice(0, 26),
  },
};

export const EmptyChannels: Story = {
  args: {
    panelId: 'PN-10-662853-5226',
    wallNumber: 4,
    slotNumber: 22,
    utilization: 20,
    cropCount: 15,
    crops: [
      ...Array(8).fill(null).map((_, i) => createMockCrop(`crop-${i}`, 'Lettuce', 1)),
      ...Array(7).fill(null).map((_, i) => createMockCrop(`crop-${i}`, 'Spinach', 3)),
    ],
  },
};

export const WithOverdueCrops: Story = {
  args: {
    panelId: 'PN-10-662854-5227',
    wallNumber: 1,
    slotNumber: 3,
    utilization: 65,
    cropCount: 49,
    crops: createCropsForPanel().map((crop, index) => ({
      ...crop,
      overdue_days: index % 3 === 0 ? Math.floor(Math.random() * 7) + 1 : 0,
      status: index % 3 === 0 ? 'overdue' : 'growing',
    })),
  },
};