import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import VerticalTabNav from '../../shared/components/ui/VerticalTabNav';
import { TabOption } from '../../shared/components/ui/VerticalTabNav/types';

const meta: Meta<typeof VerticalTabNav> = {
  title: 'Components/VerticalTabNav',
  component: VerticalTabNav,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VerticalTabNav>;

const defaultOptions: TabOption[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'environment', label: 'Environment & Recipes' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'devices', label: 'Devices' },
];

const VerticalTabNavWithState = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  
  return (
    <VerticalTabNav 
      options={defaultOptions} 
      value={activeTab} 
      onChange={setActiveTab} 
    />
  );
};

export const Default: Story = {
  render: () => <VerticalTabNavWithState />,
};