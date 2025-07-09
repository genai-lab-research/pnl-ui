import type { Meta, StoryObj } from '@storybook/react';
import { CropsTable } from './CropsTable';
import type { CropData } from './types';

const meta: Meta<typeof CropsTable> = {
  title: 'UI/CropsTable',
  component: CropsTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockCrops: CropData[] = [
  {
    id: '1',
    seed_type: 'Salanova Countkevi',
    seed_date: '2025-01-30',
    transplanting_date_planned: '2025-02-15',
    harvesting_date_planned: '2025-03-15',
    age: 26,
    overdue_days: 0,
    cultivation_area_count: 40,
    nursery_table_count: 30,
  },
  {
    id: '2',
    seed_type: 'Arugula',
    seed_date: '2025-01-25',
    transplanting_date_planned: '2025-02-10',
    harvesting_date_planned: '2025-03-10',
    age: 33,
    overdue_days: 2,
    cultivation_area_count: 55,
    nursery_table_count: 10,
  },
  {
    id: '3',
    seed_type: 'Rex Butterhead',
    seed_date: '2025-02-01',
    transplanting_date_planned: '2025-02-20',
    harvesting_date_planned: '2025-03-20',
    age: 24,
    overdue_days: 0,
    cultivation_area_count: 65,
    nursery_table_count: 10,
  },
  {
    id: '4',
    seed_type: 'Lollo Rossa',
    seed_date: '2025-02-05',
    transplanting_date_planned: '2025-02-25',
    harvesting_date_planned: '2025-03-25',
    age: 18,
    overdue_days: 0,
    cultivation_area_count: 35,
    nursery_table_count: 25,
  },
];

export const Default: Story = {
  args: {
    crops: mockCrops,
  },
};

export const Loading: Story = {
  args: {
    crops: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    crops: [],
  },
};

export const WithRowClick: Story = {
  args: {
    crops: mockCrops,
    onRowClick: (crop: CropData) => {
      console.log('Clicked crop:', crop);
    },
  },
};