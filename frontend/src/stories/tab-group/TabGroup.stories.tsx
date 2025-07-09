import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TabGroup from '../../shared/components/ui/TabGroup';
import { TabOption } from '../../shared/components/ui/TabGroup/types';

const meta: Meta<typeof TabGroup> = {
  title: 'Components/TabGroup',
  component: TabGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabGroup>;

const defaultOptions: TabOption[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
];

const TabGroupWithState = () => {
  const [activeTab, setActiveTab] = useState('week');
  
  return (
    <TabGroup 
      options={defaultOptions} 
      value={activeTab} 
      onChange={setActiveTab} 
    />
  );
};

export const Default: Story = {
  render: () => <TabGroupWithState />,
};