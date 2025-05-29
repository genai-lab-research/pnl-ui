import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ToggleOption } from '../shared/components/ui/ToggleOption';

const ToggleOptionExample: React.FC = () => {
  const [toggleStates, setToggleStates] = useState({
    shadowService: true,
    autoScaling: false,
    maintenanceMode: false,
    notifications: true,
  });

  const handleToggleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggleStates({
      ...toggleStates,
      [name]: event.target.checked,
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: '500px', mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Service Settings
      </Typography>
      
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ToggleOption
          label="Enable Shadow Service"
          checked={toggleStates.shadowService}
          onChange={handleToggleChange('shadowService')}
        />
        
        <ToggleOption
          label="Enable Auto-scaling"
          checked={toggleStates.autoScaling}
          onChange={handleToggleChange('autoScaling')}
          color="#4CAF50" // Custom green color
        />
        
        <ToggleOption
          label="Maintenance Mode"
          checked={toggleStates.maintenanceMode}
          onChange={handleToggleChange('maintenanceMode')}
          color="#F44336" // Custom red color
        />
        
        <ToggleOption
          label="Enable Notifications"
          checked={toggleStates.notifications}
          onChange={handleToggleChange('notifications')}
          size="small"
        />
      </Box>
    </Paper>
  );
};

export default ToggleOptionExample;