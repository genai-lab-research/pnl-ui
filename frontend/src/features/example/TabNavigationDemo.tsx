import React, { useState } from 'react';
import { TabNavigation } from '../../shared/components/ui/TabNavigation';
import { Typography, Box, Paper } from '@mui/material';

export const TabNavigationDemo: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState('tab1');
  
  const tabs = [
    { id: 'tab1', label: 'Overview' },
    { id: 'tab2', label: 'Environment & Recipes' },
    { id: 'tab3', label: 'Inventory' },
    { id: 'tab4', label: 'Devices' },
  ];
  
  // Simple content for each tab to demonstrate tab switching
  const getTabContent = () => {
    switch (activeTabId) {
      case 'tab1':
        return 'Overview tab content';
      case 'tab2':
        return 'Environment & Recipes tab content';
      case 'tab3':
        return 'Inventory tab content';
      case 'tab4':
        return 'Devices tab content';
      default:
        return 'Select a tab';
    }
  };
  
  return (
    <Paper sx={{ p: 3, maxWidth: '800px' }}>
      <Typography variant="h5" gutterBottom>
        Tab Navigation Component
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TabNavigation 
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        />
      </Box>
      
      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '4px', minHeight: '100px' }}>
        <Typography>{getTabContent()}</Typography>
      </Box>
    </Paper>
  );
};

export default TabNavigationDemo;