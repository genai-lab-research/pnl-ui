import type { Meta, StoryObj } from '@storybook/react';
import { GridStatusCard } from './GridStatusCard';
import { GridItem } from './types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const meta = {
  title: 'UI/GridStatusCard',
  component: GridStatusCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    utilization: {
      control: { type: 'range', min: 0, max: 100, step: 5 }
    },
    progressValue: {
      control: { type: 'range', min: 0, max: 100, step: 5 }
    },
    gridRows: {
      control: { type: 'number', min: 1, max: 20 }
    },
    gridColumns: {
      control: { type: 'number', min: 1, max: 30 }
    }
  }
} satisfies Meta<typeof GridStatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const generateGridData = (rows: number, cols: number, type: 'farming' | 'server' | 'inventory' = 'farming'): GridItem[][] => {
  const grid: GridItem[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: GridItem[] = [];
    for (let j = 0; j < cols; j++) {
      const random = Math.random();
      let status: GridItem['status'];
      
      if (type === 'server') {
        if (random > 0.95) status = 'error';
        else if (random > 0.9) status = 'warning';
        else if (random > 0.1) status = 'active';
        else status = 'inactive';
      } else if (type === 'inventory') {
        if (random > 0.7) status = 'active';
        else if (random > 0.3) status = 'pending';
        else status = 'inactive';
      } else {
        status = random > 0.15 ? 'active' : 'inactive';
      }
      
      row.push({
        id: `${i}-${j}`,
        status,
      });
    }
    grid.push(row);
  }
  return grid;
};

export const VerticalFarming: Story = {
  args: {
    slotLabel: 'SLOT',
    slotNumber: '5',
    title: 'TR-15199256',
    utilization: 75,
    progressValue: 0,
    gridRows: 10,
    gridColumns: 20,
    gridData: generateGridData(10, 20, 'farming'),
    gridLabel: '10 × 20 Grid',
    itemCount: 170,
    itemLabel: 'crops',
    actionLabel: 'Add Tray',
    showProgress: true,
    onActionClick: () => console.log('Add Tray clicked')
  }
};

export const ServerRackMonitoring: Story = {
  args: {
    slotLabel: 'RACK',
    slotNumber: 'A3',
    title: 'SRV-CLUSTER-01',
    utilization: 82,
    progressValue: 82,
    gridRows: 8,
    gridColumns: 12,
    gridData: generateGridData(8, 12, 'server'),
    gridLabel: '8 × 12 Servers',
    itemCount: 78,
    itemLabel: 'servers online',
    actionLabel: 'Add Server',
    showProgress: true,
    progressColor: '#2196F3',
    statusColors: {
      active: '#00FF00',
      inactive: '#808080',
      pending: '#FFFF00',
      warning: '#FFA500',
      error: '#FF0000',
      custom: '#0000FF',
    },
    onActionClick: () => console.log('Add Server clicked')
  }
};

export const InventoryManagement: Story = {
  args: {
    slotLabel: 'WAREHOUSE',
    slotNumber: 'B',
    title: 'INV-2024-Q1',
    utilization: 60,
    progressValue: 60,
    progressColor: '#4A90E2',
    gridRows: 5,
    gridColumns: 10,
    gridData: generateGridData(5, 10, 'inventory'),
    gridLabel: '5 × 10 Units',
    itemCount: 35,
    itemLabel: 'units active',
    actionLabel: 'Configure',
    actionIcon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
    showProgress: true,
    statusColors: {
      active: '#4A90E2',
      inactive: '#E0E0E0',
      pending: '#FFC107',
      warning: '#FF9800',
      error: '#F44336',
      custom: '#9C27B0',
    },
    onActionClick: () => console.log('Configure clicked')
  }
};

export const LoadingState: Story = {
  args: {
    loading: true,
  }
};

export const ErrorState: Story = {
  args: {
    error: 'Failed to load grid data. Please try again.',
  }
};

export const NoSlotLabel: Story = {
  args: {
    title: 'STANDALONE-001',
    utilization: 50,
    showProgress: false,
    gridRows: 6,
    gridColumns: 15,
    gridData: generateGridData(6, 15, 'farming'),
    gridLabel: '6 × 15 Matrix',
    itemCount: 45,
    itemLabel: 'items',
    actionLabel: 'Manage',
    onActionClick: () => console.log('Manage clicked'),
  }
};

export const Interactive: Story = {
  args: {
    slotLabel: 'ZONE',
    slotNumber: '7',
    title: 'INT-GRID-42',
    utilization: 65,
    progressValue: 30,
    showProgress: true,
    gridRows: 8,
    gridColumns: 16,
    gridData: generateGridData(8, 16, 'server'),
    gridLabel: '8 × 16 Interactive',
    itemCount: 82,
    itemLabel: 'cells active',
    actionLabel: 'Edit Grid',
    onActionClick: () => alert('Edit Grid clicked!'),
    onGridItemClick: (row, col, item) => {
      console.log(`Cell clicked at [${row}, ${col}]`, item);
      alert(`Cell clicked at position [${row}, ${col}] with status: ${item.status}`);
    },
  }
};