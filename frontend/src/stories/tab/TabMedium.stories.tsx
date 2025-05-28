import { useState } from 'react';

import { Stack } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { TabMedium } from '../../shared/components/ui/Tab';

const meta: Meta<typeof TabMedium> = {
  title: 'Components/Tab/TabMedium',
  component: TabMedium,
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
type Story = StoryObj<typeof TabMedium>;

export const Default: Story = {
  args: {
    children: 'Dashboard',
    active: false,
  },
};

export const Active: Story = {
  args: {
    children: 'Dashboard',
    active: true,
  },
};

export const WithBadge: Story = {
  args: {
    children: 'Dashboard',
    active: true,
    showBadge: true,
    badgeContent: '5',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Dashboard',
    disabled: true,
  },
};

// Tab Group Example
const TabGroupExample = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Dashboard', badge: null },
    { name: 'Containers', badge: '5' },
    { name: 'Reports', badge: null },
  ];

  return (
    <Stack direction="row" spacing={0}>
      {tabs.map((tab, index) => (
        <TabMedium
          key={index}
          active={activeTab === index}
          onClick={() => setActiveTab(index)}
          showBadge={!!tab.badge}
          badgeContent={tab.badge}
        >
          {tab.name}
        </TabMedium>
      ))}
    </Stack>
  );
};

export const TabGroup: Story = {
  render: () => <TabGroupExample />,
};
