import React, { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import {
  TabGroupContainer,
  TabGroupContainerProps,
} from '../../shared/components/ui/Container/TabGroupContainer';

const meta: Meta<typeof TabGroupContainer> = {
  title: 'Container/TabGroupContainer',
  component: TabGroupContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TabGroupContainer>;

// Wrapper component for handling state
const TabGroupContainerWithState = (args: TabGroupContainerProps) => {
  const [value, setValue] = useState(args.value);

  const handleChange = (newValue: string | number) => {
    setValue(newValue);
  };

  return (
    <div className="w-[600px]">
      <TabGroupContainer {...args} value={value} onChange={handleChange} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <TabGroupContainerWithState {...args} />,
  args: {
    tabs: [
      { label: 'Overview', value: 'overview' },
      { label: 'Environment & Recipes', value: 'environment' },
      { label: 'Inventory', value: 'inventory' },
      { label: 'Devices', value: 'devices' },
    ],
    value: 'overview',
  },
};

export const Small: Story = {
  render: (args) => <TabGroupContainerWithState {...args} />,
  args: {
    tabs: [
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
      { label: 'Quarter', value: 'quarter' },
      { label: 'Year', value: 'year' },
    ],
    value: 'week',
    size: 'small',
  },
};

export const Scrollable: Story = {
  render: (args) => <TabGroupContainerWithState {...args} />,
  args: {
    tabs: [
      { label: 'Overview', value: 'overview' },
      { label: 'Environment', value: 'environment' },
      { label: 'Recipes', value: 'recipes' },
      { label: 'Inventory', value: 'inventory' },
      { label: 'Devices', value: 'devices' },
      { label: 'Performance', value: 'performance' },
      { label: 'Maintenance', value: 'maintenance' },
      { label: 'Settings', value: 'settings' },
    ],
    value: 'overview',
    variant: 'scrollable',
  },
};
