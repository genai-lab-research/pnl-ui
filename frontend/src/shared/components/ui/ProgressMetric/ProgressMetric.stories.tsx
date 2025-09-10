import type { Meta, StoryObj } from '@storybook/react';
import { ProgressMetric } from './ProgressMetric';

const meta: Meta<typeof ProgressMetric> = {
  title: 'UI/ProgressMetric',
  component: ProgressMetric,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable progress metric component that displays a label, value, and optional progress bar. Perfect for showing utilization, completion rates, or any percentage-based metrics.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Main label text for the metric',
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Numeric value (0-100) representing the percentage',
    },
    unit: {
      control: 'text',
      description: 'Unit to display after the value',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the percentage value text',
    },
    showProgressBar: {
      control: 'boolean',
      description: 'Whether to show the progress bar',
    },
    progressColor: {
      control: 'color',
      description: 'Color theme for the progress bar',
    },
    progressBackgroundColor: {
      control: 'color',
      description: 'Background color for the progress bar track',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'outlined'],
      description: 'Visual variant of the component',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Utilization',
    value: 75,
    unit: '%',
    showValue: true,
    showProgressBar: true,
  },
};

export const CPUUsage: Story = {
  args: {
    label: 'CPU Usage',
    value: 42,
    unit: '%',
    showValue: true,
    showProgressBar: true,
    progressColor: '#3B82F6',
  },
};

export const MemoryConsumption: Story = {
  args: {
    label: 'Memory',
    value: 89,
    unit: '%',
    showValue: true,
    showProgressBar: true,
    progressColor: '#F59E0B',
  },
};

export const StorageCapacity: Story = {
  args: {
    label: 'Storage',
    value: 95,
    unit: '%',
    showValue: true,
    showProgressBar: true,
    progressColor: '#EF4444',
  },
};

export const NetworkBandwidth: Story = {
  args: {
    label: 'Network',
    value: 28,
    unit: '%',
    showValue: true,
    showProgressBar: true,
    progressColor: '#8B5CF6',
  },
};

export const BatteryLevel: Story = {
  args: {
    label: 'Battery',
    value: 65,
    unit: '%',
    showValue: true,
    showProgressBar: true,
    progressColor: '#10B981',
  },
};

export const CompletionRate: Story = {
  args: {
    label: 'Completion',
    value: 100,
    unit: '%',
    showValue: true,
    showProgressBar: true,
    progressColor: '#30CA45',
  },
};

export const OutlinedVariant: Story = {
  args: {
    label: 'Progress',
    value: 60,
    unit: '%',
    variant: 'outlined',
    showValue: true,
    showProgressBar: true,
  },
};

export const SmallSize: Story = {
  args: {
    label: 'Efficiency',
    value: 82,
    unit: '%',
    size: 'sm',
    showValue: true,
    showProgressBar: true,
  },
};

export const LargeSize: Story = {
  args: {
    label: 'Performance',
    value: 91,
    unit: '%',
    size: 'lg',
    showValue: true,
    showProgressBar: true,
  },
};

export const NoProgressBar: Story = {
  args: {
    label: 'Score',
    value: 88,
    unit: ' pts',
    showValue: true,
    showProgressBar: false,
  },
};

export const NoValue: Story = {
  args: {
    label: 'Progress',
    value: 45,
    showValue: false,
    showProgressBar: true,
  },
};

export const Loading: Story = {
  args: {
    label: 'Loading',
    value: 0,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Error',
    value: 0,
    error: 'Failed to load metric data',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    value: 50,
    disabled: true,
    showValue: true,
    showProgressBar: true,
  },
};

export const Clickable: Story = {
  args: {
    label: 'Click Me',
    value: 70,
    showValue: true,
    showProgressBar: true,
    onClick: () => alert('ProgressMetric clicked!'),
  },
};

export const CustomColors: Story = {
  args: {
    label: 'Custom',
    value: 55,
    progressColor: '#FF6B6B',
    progressBackgroundColor: '#4ECDC4',
    showValue: true,
    showProgressBar: true,
  },
};

export const ZeroValue: Story = {
  args: {
    label: 'Empty',
    value: 0,
    showValue: true,
    showProgressBar: true,
  },
};

export const MaxValue: Story = {
  args: {
    label: 'Full',
    value: 100,
    showValue: true,
    showProgressBar: true,
  },
};