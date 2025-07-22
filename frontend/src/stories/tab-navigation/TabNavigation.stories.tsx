import * as React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
// import type { TabItem } from '../../shared/components/ui/TabNavigation';
import { TabNavigation } from '../../shared/components/ui/TabNavigation';

const meta = {
  title: 'UI/TabNavigation',
  component: TabNavigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive example of the TabNavigation component with working tab switching
 */
export const Interactive: Story = {
  args: {
    tabs: [
      { id: 'tab1', label: 'Overview' },
      { id: 'tab2', label: 'Environment & Recipes' },
      { id: 'tab3', label: 'Inventory' },
      { id: 'tab4', label: 'Devices' },
    ],
    activeTabId: 'tab1',
    onTabChange: () => {},
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeTabId, setActiveTabId] = useState(args.activeTabId);
    
    return (
      <TabNavigation 
        {...args}
        tabs={args.tabs}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
      />
    );
  }
};

/**
 * Default state with "Overview" tab selected
 */
export const DefaultState: Story = {
  args: {
    tabs: [
      { id: 'tab1', label: 'Overview' },
      { id: 'tab2', label: 'Environment & Recipes' },
      { id: 'tab3', label: 'Inventory' },
      { id: 'tab4', label: 'Devices' },
    ],
    activeTabId: 'tab1',
    onTabChange: () => {},
  },
};

/**
 * Environment tab selected
 */
export const EnvironmentSelected: Story = {
  args: {
    tabs: [
      { id: 'tab1', label: 'Overview' },
      { id: 'tab2', label: 'Environment & Recipes' },
      { id: 'tab3', label: 'Inventory' },
      { id: 'tab4', label: 'Devices' },
    ],
    activeTabId: 'tab2',
    onTabChange: () => {},
  },
};