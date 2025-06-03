import type { Meta, StoryObj } from '@storybook/react';
import { AddTraySlot } from '../../shared/components/ui/TrayGridviewCrops';

const meta: Meta<typeof AddTraySlot> = {
  title: 'UI Components/GridProgressDisplay/AddTraySlot',
  component: AddTraySlot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An empty slot component for adding new trays to the grid system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    slotNumber: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'The slot number to display (e.g., "SLOT 4")',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when the add slot is clicked',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, will disable the component with reduced opacity',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    slotNumber: 4,
  },
};

export const Slot1: Story = {
  args: {
    slotNumber: 1,
  },
};

export const Slot8: Story = {
  args: {
    slotNumber: 8,
  },
};

export const Disabled: Story = {
  args: {
    slotNumber: 4,
    disabled: true,
  },
};

export const Interactive: Story = {
  args: {
    slotNumber: 4,
    onClick: () => alert('Add Tray clicked!'),
  },
};