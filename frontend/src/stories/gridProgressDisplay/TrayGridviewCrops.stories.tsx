import type { Meta, StoryObj } from '@storybook/react';
import { TrayGridviewCrops } from '../../shared/components/ui/TrayGridviewCrops';

const meta: Meta<typeof TrayGridviewCrops> = {
  title: 'UI/TrayGridviewCrops',
  component: TrayGridviewCrops,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value in percentage (0-100)'
    },
    rows: {
      control: { type: 'range', min: 2, max: 20, step: 1 },
      description: 'Number of rows in the grid'
    },
    columns: {
      control: { type: 'range', min: 2, max: 30, step: 1 },
      description: 'Number of columns in the grid'
    },
    title: {
      control: 'text',
      description: 'Title text to display'
    },
    itemCode: {
      control: 'text',
      description: 'Item code to display (e.g., "TR-15199256")'
    },
    gridSizeText: {
      control: 'text',
      description: 'Text to display for grid dimensions'
    },
    itemCount: {
      control: 'number',
      description: 'Number of items'
    },
    itemLabel: {
      control: 'text',
      description: 'Item label (e.g., "crops")'
    },
    disabled: {
      control: 'boolean',
      description: 'If true, will disable the component'
    }
  }
};

export default meta;
type Story = StoryObj<typeof TrayGridviewCrops>;

// Primary (default) example
export const Default: Story = {
  args: {
    title: 'SLOT 1',
    itemCode: 'TR-15199256',
    value: 75,
    rows: 20,
    columns: 10,
    gridSizeText: '10x20 Grid',
    itemCount: 170,
    itemLabel: 'crops',
    disabled: false,
  },
};

// Example matching the provided reference image
export const ReferenceExample: Story = {
  args: {
    title: 'SLOT 1',
    itemCode: 'TR-15199256',
    value: 75,
    rows: 20,
    columns: 10,
    gridSizeText: '10x20 Grid',
    itemCount: 170,
    itemLabel: 'crops',
  },
};

// Lower percentage example
export const LowProgress: Story = {
  args: {
    title: 'SLOT 2',
    value: 25,
    rows: 20,
    columns: 10,
    gridSizeText: '10x20 Grid',
    itemCount: 170,
    itemLabel: 'crops',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    title: 'SLOT 1',
    value: 75,
    rows: 20,
    columns: 10,
    gridSizeText: '10x20 Grid',
    itemCount: 170,
    itemLabel: 'crops',
    disabled: true,
  },
};

// Different grid size
export const SmallGrid: Story = {
  args: {
    title: 'SMALL',
    value: 50,
    rows: 10,
    columns: 5,
    gridSizeText: '5x10 Grid',
    itemCount: 50,
    itemLabel: 'crops',
  },
};