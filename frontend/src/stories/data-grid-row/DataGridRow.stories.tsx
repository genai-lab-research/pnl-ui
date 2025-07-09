import type { Meta, StoryObj } from '@storybook/react';
import DataGridRow from '../../shared/components/ui/DataGridRow';
import { DataGridRowProps } from '../../shared/components/ui/DataGridRow/types';

const meta: Meta<typeof DataGridRow> = {
  title: 'UI/DataGridRow',
  component: DataGridRow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataGridRow>;

const defaultArgs: DataGridRowProps = {
  cropName: 'Rex Butterhead',
  generation: 65,
  cycles: 10,
  seedingDate: '2025-01-10',
  harvestDate: '2025-01-20',
  inspectionDate: '2025-01-01',
  beds: 22,
  status: {
    type: 'active',
    count: 0
  }
};

export const Default: Story = {
  args: defaultArgs,
};

export const WithHighCycleCount: Story = {
  args: {
    ...defaultArgs,
    cycles: 99,
  },
};

export const WithHighStatusCount: Story = {
  args: {
    ...defaultArgs,
    status: {
      type: 'active',
      count: 25
    }
  },
};