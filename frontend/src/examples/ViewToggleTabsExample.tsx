import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ViewToggleTabs, ViewMode } from '../shared/components/ui/ViewToggleTabs';

const demoItems = [
  { id: 1, name: 'Container 1', status: 'Active' },
  { id: 2, name: 'Container 2', status: 'Inactive' },
  { id: 3, name: 'Container 3', status: 'Active' },
  { id: 4, name: 'Container 4', status: 'Active' },
  { id: 5, name: 'Container 5', status: 'Maintenance' },
  { id: 6, name: 'Container 6', status: 'Active' },
];

const ViewToggleTabsExample: React.FC = () => {
  const [view, setView] = useState<ViewMode>('list');

  const handleViewChange = (_event: React.SyntheticEvent, newView: ViewMode) => {
    setView(newView);
  };

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h5">Containers</Typography>
        <ViewToggleTabs
          value={view}
          onChange={handleViewChange}
          activeBackgroundColor="#455168"
          activeIconColor="#FFFFFF"
          inactiveIconColor="#455168"
        />
      </Box>

      {view === 'list' ? (
        // List view
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 150px', 
            padding: 2,
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
            fontWeight: 500
          }}>
            <Box>Name</Box>
            <Box>Status</Box>
          </Box>
          {demoItems.map((item) => (
            <Box 
              key={item.id} 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 150px', 
                padding: 2,
                borderBottom: '1px solid #f5f5f5',
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <Box>{item.name}</Box>
              <Box>{item.status}</Box>
            </Box>
          ))}
        </Box>
      ) : (
        // Grid view
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, 
          gap: 2 
        }}>
          {demoItems.map((item) => (
            <Box 
              key={item.id}
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box 
                sx={{ 
                  backgroundColor: '#f5f5f5', 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 2,
                  fontWeight: 500,
                  fontSize: '1.5rem',
                  color: '#455168'
                }}
              >
                {item.id}
              </Box>
              <Typography variant="subtitle1">{item.name}</Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{
                  backgroundColor: item.status === 'Active' ? '#e6f4ea' : 
                                  item.status === 'Inactive' ? '#f8f9fa' : '#fef7e0',
                  padding: '4px 8px',
                  borderRadius: 1,
                  marginTop: 1
                }}
              >
                {item.status}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ViewToggleTabsExample;