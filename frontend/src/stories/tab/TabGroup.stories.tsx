import React, { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { TabGroup, TabGroupProps } from '../../shared/components/ui/Tab/TabGroup';

const meta: Meta<typeof TabGroup> = {
  title: 'Tab/TabGroup',
  component: TabGroup,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof TabGroup>;

// Wrapper component for handling state
const TabGroupWithState = (args: TabGroupProps) => {
  const [value, setValue] = useState(args.value);

  const handleChange = (newValue: string | number) => {
    setValue(newValue);
  };

  return (
    <div className="w-[500px]">
      <TabGroup {...args} value={value} onChange={handleChange} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <TabGroupWithState {...args} />,
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
  render: (args) => <TabGroupWithState {...args} />,
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

export const WithDisabledTab: Story = {
  render: (args) => <TabGroupWithState {...args} />,
  args: {
    tabs: [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Maintenance', value: 'maintenance', disabled: true },
    ],
    value: 'all',
  },
};

export const Scrollable: Story = {
  render: (args) => <TabGroupWithState {...args} />,
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
