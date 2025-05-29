import React from 'react';
import ControlPanelHeader from '../shared/components/ui/ControlPanelHeader';
import { Box } from '@mui/material';

const ControlPanelHeaderExample: React.FC = () => {
  return (
    <Box sx={{ width: '100%', height: '100vh' }}>
      <ControlPanelHeader title="Control Panel" avatarSrc="https://i.pravatar.cc/300" />
      <Box sx={{ p: 3 }}>
        <h2>Content below the header</h2>
        <p>This is an example of the ControlPanelHeader component in action.</p>
      </Box>
    </Box>
  );
};

export default ControlPanelHeaderExample;
