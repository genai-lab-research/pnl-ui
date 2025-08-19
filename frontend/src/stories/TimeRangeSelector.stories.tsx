import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TimeRangeSelector } from '../shared/components/ui/TimeRangeSelector';
import { TimeRange } from '../shared/components/ui/TimeRangeSelector/types';

const meta = {
  title: 'UI/TimeRangeSelector',
  component: TimeRangeSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A tab-style selector component for switching between time ranges (Week, Month, Quarter, Year) in the Vertical-Farming Control Panel.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectedValue: {
      control: { type: 'select' },
      options: ['Week', 'Month', 'Quarter', 'Year'],
      description: 'Currently selected time range',
    },
    onValueChange: {
      action: 'value-changed',
      description: 'Callback when a time range is selected',
    },
    options: {
      control: 'object',
      description: 'Available time range options',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire selector is disabled',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the selector',
    },
    'aria-label': {
      control: 'text',
      description: 'ARIA label for accessibility',
    },
  },
} satisfies Meta<typeof TimeRangeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedValue: 'Week',
    size: 'medium',
    disabled: false,
    onValueChange: () => {},
  },
};

export const MonthSelected: Story = {
  args: {
    selectedValue: 'Month',
    size: 'medium',
    disabled: false,
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Time range selector with Month selected.',
      },
    },
  },
};

export const QuarterSelected: Story = {
  args: {
    selectedValue: 'Quarter',
    size: 'medium',
    disabled: false,
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Time range selector with Quarter selected.',
      },
    },
  },
};

export const YearSelected: Story = {
  args: {
    selectedValue: 'Year',
    size: 'medium',
    disabled: false,
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Time range selector with Year selected.',
      },
    },
  },
};

export const SmallSize: Story = {
  args: {
    selectedValue: 'Week',
    size: 'small',
    disabled: false,
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Smaller variant of the time range selector.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    selectedValue: 'Month',
    size: 'large',
    disabled: false,
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Larger variant of the time range selector.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    selectedValue: 'Quarter',
    size: 'medium',
    disabled: true,
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state of the time range selector.',
      },
    },
  },
};

export const CustomOptions: Story = {
  args: {
    selectedValue: 'Week',
    options: [
      { value: 'Week', label: 'Weekly' },
      { value: 'Month', label: 'Monthly' },
      { value: 'Year', label: 'Yearly' },
    ],
    size: 'medium',
    disabled: false,
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Time range selector with custom options and labels.',
      },
    },
  },
};

export const PartiallyDisabled: Story = {
  args: {
    selectedValue: 'Week',
    options: [
      { value: 'Week', label: 'Week' },
      { value: 'Month', label: 'Month', disabled: true },
      { value: 'Quarter', label: 'Quarter' },
      { value: 'Year', label: 'Year', disabled: true },
    ],
    size: 'medium',
    disabled: false,
    onValueChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Time range selector with some options disabled.',
      },
    },
  },
};

const InteractiveTimeRangeSelector = () => {
  const [selectedValue, setSelectedValue] = useState<TimeRange>('Week');

  return (
    <TimeRangeSelector
      selectedValue={selectedValue}
      onValueChange={setSelectedValue}
      size="medium"
    />
  );
};

export const Interactive: Story = {
  args: {
    selectedValue: 'Week',
    onValueChange: () => {},
  },
  render: () => <InteractiveTimeRangeSelector />,
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive time range selector that responds to clicks and keyboard navigation (arrow keys, Enter, Space).',
      },
    },
  },
};

export const ResponsiveDemo: Story = {
  args: {
    selectedValue: 'Month',
    size: 'medium',
    disabled: false,
    onValueChange: () => {},
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
      },
    },
    docs: {
      description: {
        story: 'This story demonstrates the responsive behavior of the TimeRangeSelector component. On mobile, options stack vertically.',
      },
    },
  },
};

export const AllStates: Story = {
  args: {
    selectedValue: 'Week',
    onValueChange: () => {},
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div>
        <h3 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#666' }}>Week Selected</h3>
        <TimeRangeSelector selectedValue="Week" onValueChange={() => {}} />
      </div>
      <div>
        <h3 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#666' }}>Month Selected</h3>
        <TimeRangeSelector selectedValue="Month" onValueChange={() => {}} />
      </div>
      <div>
        <h3 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#666' }}>Quarter Selected</h3>
        <TimeRangeSelector selectedValue="Quarter" onValueChange={() => {}} />
      </div>
      <div>
        <h3 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#666' }}>Year Selected</h3>
        <TimeRangeSelector selectedValue="Year" onValueChange={() => {}} />
      </div>
      <div>
        <h3 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#666' }}>Disabled</h3>
        <TimeRangeSelector selectedValue="Month" onValueChange={() => {}} disabled />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All possible states of the time range selector component.',
      },
    },
  },
};