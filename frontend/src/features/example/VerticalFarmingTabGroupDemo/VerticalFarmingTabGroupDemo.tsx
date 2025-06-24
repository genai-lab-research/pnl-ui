import React, { useState } from 'react';
import { VerticalFarmingTabGroup } from '../../../shared/components/ui';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';

const VerticalFarmingTabGroupDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('nursery');

  const tabOptions = [
    {
      value: 'nursery',
      label: 'Nursery Station',
      icon: <CalendarMonthIcon style={{ color: activeTab === 'nursery' ? '#3545EE' : '#49454F' }} />
    },
    {
      value: 'cultivation',
      label: 'Cultivation Area',
      icon: <ViewWeekIcon style={{ color: activeTab === 'cultivation' ? '#3545EE' : '#49454F' }} />
    }
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Vertical Farming Tab Group Demo</h2>
      <div style={{ marginTop: '20px' }}>
        <VerticalFarmingTabGroup
          options={tabOptions}
          value={activeTab}
          onChange={handleTabChange}
        />
        <div style={{ marginTop: '20px' }}>
          {activeTab === 'nursery' && (
            <div>
              <h3>Nursery Station Content</h3>
              <p>This is the content for the Nursery Station tab.</p>
            </div>
          )}
          {activeTab === 'cultivation' && (
            <div>
              <h3>Cultivation Area Content</h3>
              <p>This is the content for the Cultivation Area tab.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalFarmingTabGroupDemo;
