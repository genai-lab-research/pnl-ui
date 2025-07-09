import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import VerticalFarmingTabGroup from '../../shared/components/ui/VerticalFarmingTabGroup';
import { TabOption } from '../../shared/components/ui/VerticalFarmingTabGroup/types';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';

const meta: Meta<typeof VerticalFarmingTabGroup> = {
  title: 'Components/VerticalFarmingTabGroup',
  component: VerticalFarmingTabGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VerticalFarmingTabGroup>;

const verticalFarmingOptions: TabOption[] = [
  { 
    value: 'nursery', 
    label: 'Nursery Station',
    icon: <CalendarMonthIcon style={{ color: '#3545EE' }} />
  },
  { 
    value: 'cultivation', 
    label: 'Cultivation Area',
    icon: <ViewWeekIcon style={{ color: '#49454F' }} />
  },
];

const VerticalFarmingTabGroupWithState = () => {
  const [activeTab, setActiveTab] = useState('nursery');
  
  return (
    <VerticalFarmingTabGroup 
      options={verticalFarmingOptions} 
      value={activeTab} 
      onChange={setActiveTab} 
    />
  );
};

export const Default: Story = {
  render: () => <VerticalFarmingTabGroupWithState />,
};