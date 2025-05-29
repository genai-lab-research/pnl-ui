import React, { useState } from 'react';
import { Box, Typography, Container, Tabs } from '@mui/material';
import { DestructiveTab } from '../shared/components/ui/DestructiveTab';
import { useIsMobile } from '../shared/utils/responsive';

/**
 * Example component demonstrating the DestructiveTab component in action.
 * This example follows the design shown in the reference image.
 */
const DestructiveTabExample: React.FC = () => {
  // State for the tab groups
  const [configTab, setConfigTab] = useState(0);
  
  // Event handlers for tab changes
  const handleConfigTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setConfigTab(newValue);
  };

  // Mobile responsive behavior
  const isMobile = useIsMobile();
  const containerPadding = isMobile ? 2 : 4;

  // Render different content based on active tab
  const renderConfigContent = () => {
    switch (configTab) {
      case 0:
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Configuration Mode</Typography>
            <Typography>
              In this mode, you can configure various settings for your vertical farming system.
              This includes environment controls, recipes, schedules, and system preferences.
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Monitoring Mode</Typography>
            <Typography>
              Monitoring mode allows you to view real-time data and metrics from your
              vertical farming system without making changes to the configuration.
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Analysis Mode</Typography>
            <Typography>
              Analysis mode provides tools for analyzing historical data and trends
              to optimize your vertical farming operations and improve yields.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box p={3}>
            <Typography>Select a mode to view content</Typography>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: containerPadding }}>
      <Typography variant="h4" gutterBottom align="center">
        Vertical Farming Control Panel
      </Typography>

      {/* Single DestructiveTab matching the reference design exactly */}
      <Box sx={{ mb: 4, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1, p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Single Configuring Tab (Reference Design)
        </Typography>
        
        <Box sx={{ width: '201.5px', height: '32px' }}>
          <Tabs
            value={0}
            customIndicatorColor="#3545EE"
            sx={{
              borderRadius: '2px',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              padding: '0',
            }}
          >
            <DestructiveTab
              label="Configuring"
              sx={{
                width: '201.5px', 
                height: '32px',
                padding: '6px 12px',
                borderRadius: '2px',
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px',
                color: 'rgba(68, 68, 76, 0.87)', 
              }}
            />
          </Tabs>
        </Box>
        
        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2">
            This is an exact replica of the DestructiveTab component as shown in the reference design.
            It features a tab with a "Configuring" label, using the Inter font, with specific dimensions
            and styling to match the design specification.
          </Typography>
        </Box>
      </Box>

      {/* Example showing DestructiveTab in a group */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          DestructiveTabs in a Group
        </Typography>

        <Tabs
          value={configTab}
          onChange={handleConfigTabChange}
          customIndicatorColor="#3545EE"
        >
          <DestructiveTab label="Configuring" isFirst />
          <DestructiveTab label="Monitoring" />
          <DestructiveTab label="Analysis" isLast />
        </Tabs>

        {/* Content area */}
        <Box 
          sx={{
            mt: 2, 
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 1,
            minHeight: '200px',
          }}
        >
          {renderConfigContent()}
        </Box>
      </Box>

      {/* Example showing equal-width DestructiveTabs */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Equal-Width DestructiveTabs
        </Typography>

        <Tabs
          value={configTab}
          onChange={handleConfigTabChange}
          equalWidth
          customIndicatorColor="#3545EE"
        >
          <DestructiveTab label="Configuring" isFirst equalWidth />
          <DestructiveTab label="Monitoring" equalWidth />
          <DestructiveTab label="Analysis" isLast equalWidth />
        </Tabs>

        {/* Content area */}
        <Box 
          sx={{
            mt: 2, 
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 1,
            minHeight: '200px',
          }}
        >
          {renderConfigContent()}
        </Box>
      </Box>

      {/* Example showing DestructiveTab with a disabled state */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          DestructiveTab with Disabled State
        </Typography>

        <Tabs
          value={0}
          onChange={handleConfigTabChange}
          customIndicatorColor="#3545EE"
        >
          <DestructiveTab label="Configuring" />
          <DestructiveTab label="Restricted Area" disabled />
        </Tabs>

        {/* Content area */}
        <Box 
          sx={{
            mt: 2, 
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 1,
            minHeight: '100px',
          }}
        >
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Configuration Mode</Typography>
            <Typography>
              This example shows a disabled tab that cannot be selected. This pattern is useful
              for showing options that are not currently available due to permissions,
              system state, or other constraints.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DestructiveTabExample;