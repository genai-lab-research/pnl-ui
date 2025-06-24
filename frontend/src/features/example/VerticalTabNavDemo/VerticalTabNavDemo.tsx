import React, { useState } from 'react';
import { VerticalTabNav } from '../../../shared/components/ui';
import { TabOption } from '../../../shared/components/ui/VerticalTabNav/types';

const tabOptions: TabOption[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'environment', label: 'Environment & Recipes' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'devices', label: 'Devices' },
];

const VerticalTabNavDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Vertical Farming Control Panel Navigation</h2>
      <VerticalTabNav 
        options={tabOptions} 
        value={activeTab} 
        onChange={setActiveTab} 
      />
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #e0e0e0' }}>
        <h3>Selected Tab: {activeTab}</h3>
        <p>This is the content area for the {tabOptions.find(tab => tab.value === activeTab)?.label} tab.</p>
      </div>
    </div>
  );
};

export default VerticalTabNavDemo;
