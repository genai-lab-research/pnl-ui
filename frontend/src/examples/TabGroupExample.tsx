import React, { useState } from 'react';
import { TabGroup } from '../shared/components/ui/TabGroup';
import { Box, Typography } from '@mui/material';

const TabGroupExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState('details');

  // Define the tabs
  const tabs = [
    { label: 'Details', value: 'details' },
    { label: 'Configuring', value: 'configuring' },
  ];

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Container Information
      </Typography>
      
      <TabGroup
        tabs={tabs}
        value={activeTab}
        onChange={handleTabChange}
      />
      
      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        {activeTab === 'details' && (
          <Typography>
            This tab displays detailed information about the container.
          </Typography>
        )}
        {activeTab === 'configuring' && (
          <Typography>
            This tab allows you to configure container settings.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TabGroupExample;