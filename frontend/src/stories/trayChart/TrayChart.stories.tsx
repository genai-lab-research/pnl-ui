import type { Meta, StoryObj } from '@storybook/react';
import { TrayChart } from '../../shared/components/ui/TrayChart';
import { CropData } from '../../shared/types/inventory';

const meta: Meta<typeof TrayChart> = {
  title: 'UI/TrayChart',
  component: TrayChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: { control: 'object' },
    gridSize: { control: 'object' },
    isHighlighted: { control: 'boolean' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof TrayChart>;

const sampleCropData: CropData[] = [
  {
    id: '1',
    row: 1,
    column: 1,
    health_status: 'healthy',
    size: 'small',
    growth_stage: 'seedling',
    plant_date: '2024-01-01',
    days_since_planted: 10,
    container_id: 'container-1',
  },
  {
    id: '2',
    row: 1,
    column: 3,
    health_status: 'healthy',
    size: 'medium',
    growth_stage: 'vegetative',
    plant_date: '2024-01-01',
    days_since_planted: 20,
    container_id: 'container-1',
  },
  {
    id: '3',
    row: 2,
    column: 2,
    health_status: 'treatment_required',
    size: 'small',
    growth_stage: 'seedling',
    plant_date: '2024-01-01',
    days_since_planted: 15,
    container_id: 'container-1',
  },
  {
    id: '4',
    row: 3,
    column: 1,
    health_status: 'healthy',
    size: 'large',
    growth_stage: 'flowering',
    plant_date: '2024-01-01',
    days_since_planted: 30,
    container_id: 'container-1',
  },
  {
    id: '5',
    row: 3,
    column: 3,
    health_status: 'to_be_disposed',
    size: 'small',
    growth_stage: 'dead',
    plant_date: '2024-01-01',
    days_since_planted: 5,
    container_id: 'container-1',
  },
];

export const Default: Story = {
  args: {
    data: sampleCropData,
    gridSize: {
      rows: 4,
      columns: 4,
    },
    isHighlighted: false,
  },
};

export const Highlighted: Story = {
  args: {
    data: sampleCropData,
    gridSize: {
      rows: 4,
      columns: 4,
    },
    isHighlighted: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    gridSize: {
      rows: 4,
      columns: 4,
    },
    isHighlighted: false,
  },
};

export const LargeGrid: Story = {
  args: {
    data: [
      ...sampleCropData,
      {
        id: '6',
        row: 5,
        column: 5,
        health_status: 'healthy',
        size: 'medium',
        growth_stage: 'vegetative',
        plant_date: '2024-01-01',
        days_since_planted: 25,
        container_id: 'container-1',
      },
    ],
    gridSize: {
      rows: 6,
      columns: 6,
    },
    isHighlighted: false,
  },
};