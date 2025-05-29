import React, { useState } from 'react';
import { SettingsGroup } from '../shared/components/ui/SettingsGroup';
import { Typography, Box, Paper } from '@mui/material';

const SettingsGroupExample: React.FC = () => {
  const [shadowServiceEnabled, setShadowServiceEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  const handleShadowServiceToggle = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setShadowServiceEnabled(checked);
  };

  const handleNotificationsToggle = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setNotificationsEnabled(checked);
  };
  
  const handleDarkModeToggle = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setDarkModeEnabled(checked);
  };

  return (
    <Paper elevation={0} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        SettingsGroup Component Example
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <SettingsGroup 
          title="Settings"
          options={[
            {
              label: 'Enable Shadow Service',
              checked: shadowServiceEnabled,
              onChange: handleShadowServiceToggle,
            }
          ]}
        />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <SettingsGroup 
          title="Appearance Settings"
          options={[
            {
              label: 'Enable Notifications',
              checked: notificationsEnabled,
              onChange: handleNotificationsToggle,
            },
            {
              label: 'Dark Mode',
              checked: darkModeEnabled,
              onChange: handleDarkModeToggle,
            }
          ]}
        />
      </Box>
      
      <Box>
        <SettingsGroup 
          title="Advanced Settings"
          options={[
            {
              label: 'Developer Mode',
              checked: false,
              disabled: true,
            }
          ]}
        />
      </Box>
    </Paper>
  );
};

export default SettingsGroupExample;