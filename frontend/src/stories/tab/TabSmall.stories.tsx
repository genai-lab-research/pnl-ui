import { useState } from 'react';

import { Stack } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { TabSmall } from '../../shared/components/ui/Tab';

const meta: Meta<typeof TabSmall> = {
  title: 'Components/Tab/TabSmall',
  component: TabSmall,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    active: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    showBadge: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    badgeContent: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabSmall>;

export const Default: Story = {
  args: {
    children: 'Overview',
    active: false,
  },
};

export const Active: Story = {
  args: {
    children: 'Overview',
    active: true,
  },
};

export const WithBadge: Story = {
  args: {
    children: 'Overview',
    active: true,
    showBadge: true,
    badgeContent: '3',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Overview',
    disabled: true,
  },
};

// Tab Group Example
const TabGroupExample = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Overview', badge: null },
    { name: 'Activity', badge: '3' },
    { name: 'Settings', badge: null },
  ];

  return (
    <Stack direction="row" spacing={0}>
      {tabs.map((tab, index) => (
        <TabSmall
          key={index}
          active={activeTab === index}
          onClick={() => setActiveTab(index)}
          showBadge={!!tab.badge}
          badgeContent={tab.badge}
        >
          {tab.name}
        </TabSmall>
      ))}
    </Stack>
  );
};

export const TabGroup: Story = {
  render: () => <TabGroupExample />,
};
