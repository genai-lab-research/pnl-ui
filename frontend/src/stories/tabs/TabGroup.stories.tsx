import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { TabGroup, TabItem } from '../../shared/components/ui/TabGroup';
import { Box } from '@mui/material';

const meta: Meta<typeof TabGroup> = {
  title: 'UI/TabGroup',
  component: TabGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabGroup>;

// Create a wrapper component that manages state
const TabGroupWithState = (args: any) => {
  const [value, setValue] = useState(args.value || args.tabs[0].value);
  
  return (
    <Box sx={{ width: '100%', maxWidth: '500px' }}>
      <TabGroup 
        {...args} 
        value={value} 
        onChange={(newValue) => setValue(newValue)} 
      />
    </Box>
  );
};

// Default example with "Details" and "Configuring" tabs
export const Default: Story = {
  render: (args) => <TabGroupWithState {...args} />,
  args: {
    tabs: [
      { label: 'Details', value: 'details' },
      { label: 'Configuring', value: 'configuring' },
    ],
    value: 'details',
  },
};

// Example with multiple tabs
export const MultipleTabs: Story = {
  render: (args) => <TabGroupWithState {...args} />,
  args: {
    tabs: [
      { label: 'Overview', value: 'overview' },
      { label: 'Details', value: 'details' },
      { label: 'Configuring', value: 'configuring' },
      { label: 'Logs', value: 'logs' },
    ],
    value: 'details',
  },
};

// Example with long tab names (to test responsiveness)
export const LongTabNames: Story = {
  render: (args) => <TabGroupWithState {...args} />,
  args: {
    tabs: [
      { label: 'Container Information', value: 'information' },
      { label: 'Configuration Settings', value: 'configuration' },
      { label: 'System Parameters', value: 'parameters' },
    ],
    value: 'information',
  },
};

// Narrow container example (to test responsiveness)
export const NarrowContainer: Story = {
  render: (args) => (
    <Box sx={{ width: '250px' }}>
      <TabGroup 
        {...args} 
        value={args.value} 
        onChange={() => {}} 
      />
    </Box>
  ),
  args: {
    tabs: [
      { label: 'Details', value: 'details' },
      { label: 'Configuring', value: 'configuring' },
    ],
    value: 'details',
  },
};