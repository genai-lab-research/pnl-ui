import React from 'react';
import BreadcrumbNav from '../shared/components/ui/BreadcrumbNav';
import { Box, Paper } from '@mui/material';

/**
 * Example component demonstrating the BreadcrumbNav component
 */
const BreadcrumbNavExample: React.FC = () => {
  // Handle back button click
  const handleBackClick = () => {
    console.log('Back button clicked');
    alert('Back navigation triggered');
  };

  return (
    <Box sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <Paper elevation={0}>
        <BreadcrumbNav
          breadcrumb="Container Dashboard / farm-container-04"
          onBackClick={handleBackClick}
          avatarSrc="https://i.pravatar.cc/300"
          avatarAlt="User avatar"
        />
      </Paper>
      
      {/* Content area */}
      <Box sx={{ p: 3 }}>
        <div>Content area for container dashboard</div>
      </Box>
    </Box>
  );
};

export default BreadcrumbNavExample;