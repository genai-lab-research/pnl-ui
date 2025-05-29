import React, { useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { TabGroup, Tabs, Tab } from '../shared/components/ui/Tab';
import { useIsMobile } from '../shared/utils/responsive';

/**
 * Example component demonstrating the TabGroup component in action.
 * This example follows the design shown in the reference image.
 */
const TabsExample: React.FC = () => {
  // Define our tabs for the first tab group (using TabGroup component)
  const overviewTabs = [
    { label: 'Week', id: 'week' },
    { label: 'Month', id: 'month' },
    { label: 'Quarter', id: 'quarter' },
    { label: 'Year', id: 'year' },
  ];

  // State for the first tab group
  const [activeTimeTab, setActiveTimeTab] = useState('week');
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // State for the second tab group (using low-level Tabs and Tab components)
  const [activeContentTab, setActiveContentTab] = useState(0);

  const handleTimePeriodChange = (_event: React.SyntheticEvent, newValue: string | number) => {
    setActiveTimeTab(newValue as string);
  };

  const handleTabIndexChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
  };

  const handleContentTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveContentTab(newValue);
  };

  // Mobile responsive behavior
  const isMobile = useIsMobile();
  const containerPadding = isMobile ? 2 : 4;

  // Render different content based on active time period tab
  const renderTimeContent = () => {
    switch (activeTimeTab) {
      case 'week':
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Weekly Overview</Typography>
            <Typography>
              This view shows the data for the current week. You can see daily metrics
              and compare performance across the week.
            </Typography>
          </Box>
        );
      case 'month':
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Monthly Overview</Typography>
            <Typography>
              This view shows the data aggregated by month. You can see trends 
              across weeks and monthly performance metrics.
            </Typography>
          </Box>
        );
      case 'quarter':
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Quarterly Overview</Typography>
            <Typography>
              The quarterly view provides insights into performance over a three-month period.
              Compare monthly trends and see progress toward quarterly goals.
            </Typography>
          </Box>
        );
      case 'year':
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Yearly Overview</Typography>
            <Typography>
              The yearly view shows annual performance metrics and long-term trends.
              Compare quarterly data and visualize progress throughout the year.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box p={3}>
            <Typography>Select a time period to view data</Typography>
          </Box>
        );
    }
  };

  // Render different content based on second tab group selection
  const renderContentTabContent = () => {
    switch (activeContentTab) {
      case 0:
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Overview</Typography>
            <Typography>
              This tab shows an overview of the vertical farming system. It displays key metrics, 
              current status and a summary of activities.
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Environment & Recipes</Typography>
            <Typography>
              This tab allows you to monitor and control environmental conditions 
              such as temperature, humidity, and lighting. You can also view and modify
              growing recipes for different crops.
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Inventory</Typography>
            <Typography>
              Track inventory levels for seeds, nutrients, harvested produce, and supplies.
              View production forecasts and manage stock levels.
            </Typography>
          </Box>
        );
      case 3:
        return (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>Devices</Typography>
            <Typography>
              Monitor and control connected devices such as sensors, pumps, lights, and
              environmental controls. View device status and manage settings.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box p={3}>
            <Typography>Select a tab to view content</Typography>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: containerPadding }}>
      <Typography variant="h4" gutterBottom align="center">
        Vertical Farming Control Panel
      </Typography>

      {/* Example showing the reference design tabs using TabGroup */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Time Period Selection (TabGroup Component)
        </Typography>

        <TabGroup
          tabs={overviewTabs}
          value={activeTimeTab}
          onChange={handleTimePeriodChange}
          equalWidth
          indicatorColor="#3545EE"
        />

        {/* Content area */}
        <Box 
          sx={{
            mt: 2, 
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 1,
            minHeight: '200px',
          }}
        >
          {renderTimeContent()}
        </Box>
      </Box>

      {/* Example using the lower-level Tab and Tabs components */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Time Period Selection (Tabs & Tab Components)
        </Typography>

        <Tabs
          value={activeTabIndex}
          onChange={handleTabIndexChange}
          equalWidth
          customIndicatorColor="#3545EE"
        >
          <Tab label="Week" isFirst />
          <Tab label="Month" />
          <Tab label="Quarter" />
          <Tab label="Year" isLast />
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
          {renderTimeContent()}
        </Box>
      </Box>

      {/* Another example showing traditional tab navigation */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Content Navigation
        </Typography>

        <Tabs
          value={activeContentTab}
          onChange={handleContentTabChange}
          scrollable
          showScrollButtons={!isMobile}
          customIndicatorColor="#3545EE"
        >
          <Tab label="Overview" />
          <Tab label="Environment & Recipes" />
          <Tab label="Inventory" />
          <Tab label="Devices" />
        </Tabs>

        {/* Content area */}
        <Box 
          sx={{
            mt: 2, 
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 1,
            minHeight: '300px',
          }}
        >
          {renderContentTabContent()}
        </Box>
      </Box>
    </Container>
  );
};

export default TabsExample;