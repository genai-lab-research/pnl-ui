import React, { useState } from 'react';
import Header from '../shared/components/ui/Header';
import { Box, Paper } from '@mui/material';

/**
 * Example component demonstrating the Header component with tab navigation
 */
const HeaderExample: React.FC = () => {
  // Define tabs
  const tabs = [
    { label: 'Overview', value: 0 },
    { label: 'Inspection (3D tour)', value: 1 },
    { label: 'Environment & Recipes', value: 2 },
    { label: 'Inventory', value: 3 },
    { label: 'Devices', value: 4 },
  ];

  // Set up tab state
  const [selectedTab, setSelectedTab] = useState(0);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Handle back button click
  const handleBackClick = () => {
    console.log('Back button clicked');
    alert('Back navigation triggered');
  };

  // Content based on selected tab
  const getTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <div>Overview content goes here</div>;
      case 1:
        return <div>Inspection (3D tour) content goes here</div>;
      case 2:
        return <div>Environment & Recipes content goes here</div>;
      case 3:
        return <div>Inventory content goes here</div>;
      case 4:
        return <div>Devices content goes here</div>;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <Box sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <Paper elevation={0}>
        <Header
          breadcrumb="Container Dashboard / farm-container-04"
          title="farm-container-04"
          metadata="Physical container | Tenant-123 | Development"
          status="active"
          avatarSrc="https://i.pravatar.cc/300"
          tabs={tabs}
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          onBackClick={handleBackClick}
        />
      </Paper>
      
      {/* Content area */}
      <Box sx={{ p: 3 }}>
        {getTabContent()}
      </Box>
    </Box>
  );
};

export default HeaderExample;