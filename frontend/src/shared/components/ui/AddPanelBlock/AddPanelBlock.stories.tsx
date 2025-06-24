import type { Meta, StoryObj } from '@storybook/react';
import { AddPanelBlock } from './AddPanelBlock';

const meta = {
  title: 'Components/AddPanelBlock',
  component: AddPanelBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onAddPanelClick: { action: 'panel added' },
  },
} satisfies Meta<typeof AddPanelBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    wallNumber: 1,
    slotNumber: 5,
    onAddPanelClick: (wallNumber, slotNumber) => console.log(`Add panel to Wall ${wallNumber}, Slot ${slotNumber}`),
  },
};

export const Wall2: Story = {
  args: {
    wallNumber: 2,
    slotNumber: 12,
    onAddPanelClick: (wallNumber, slotNumber) => console.log(`Add panel to Wall ${wallNumber}, Slot ${slotNumber}`),
  },
};

export const Wall3: Story = {
  args: {
    wallNumber: 3,
    slotNumber: 8,
    onAddPanelClick: (wallNumber, slotNumber) => console.log(`Add panel to Wall ${wallNumber}, Slot ${slotNumber}`),
  },
};

export const Wall4LastSlot: Story = {
  args: {
    wallNumber: 4,
    slotNumber: 22,
    onAddPanelClick: (wallNumber, slotNumber) => console.log(`Add panel to Wall ${wallNumber}, Slot ${slotNumber}`),
  },
};