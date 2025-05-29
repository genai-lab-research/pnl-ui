import React, { useState } from 'react';
import { Box, Button, Drawer } from '@mui/material';
import { DrawerHeader } from '../shared/components/ui/DrawerHeader';

const DrawerHeaderExample: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Button variant="contained" onClick={toggleDrawer}>
        Open Drawer with Header
      </Button>
      
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={{ width: 372, p: 2 }}>
          <DrawerHeader 
            title="Create New Container" 
            onClose={() => setOpen(false)} 
          />
          {/* Drawer content would go here */}
          <Box sx={{ mt: 2 }}>
            <p>Drawer content goes here...</p>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DrawerHeaderExample;