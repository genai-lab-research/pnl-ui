import React, { useState } from 'react';
import { HasAlertsToggle } from '../shared/components/ui/HasAlertsToggle';
import { Typography, Box, Stack, Paper } from '@mui/material';

const HasAlertsToggleExample: React.FC = () => {
  const [hasAlerts, setHasAlerts] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  
  const handleAlertsToggle = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setHasAlerts(checked);
  };

  const handleNotificationsToggle = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setHasNotifications(checked);
  };

  return (
    <Paper elevation={0} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        HasAlertsToggle Component Example
      </Typography>
      
      <Stack spacing={3} sx={{ mt: 3 }}>
        <Box>
          <HasAlertsToggle 
            checked={hasAlerts}
            onChange={handleAlertsToggle}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Status: {hasAlerts ? 'Showing alerts only' : 'Showing all items'}
          </Typography>
        </Box>

        <Box>
          <HasAlertsToggle 
            checked={hasNotifications}
            onChange={handleNotificationsToggle}
            label="Show Notifications"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Status: {hasNotifications ? 'Notifications enabled' : 'Notifications disabled'}
          </Typography>
        </Box>

        <Box>
          <HasAlertsToggle disabled label="Disabled Toggle" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This toggle is disabled and cannot be interacted with
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default HasAlertsToggleExample;