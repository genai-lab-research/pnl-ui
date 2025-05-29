import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tab, Tabs, TabGroup } from '../../shared/components/ui/Tab';
import { Box } from '@mui/material';

// Create wrapper components for stories to avoid ESLint hook errors
const DefaultTabsExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange}>
      <Tab label="Overview" />
      <Tab label="Details" />
      <Tab label="Analytics" />
    </Tabs>
  );
};

const SelectedTabExample = () => {
  return (
    <Tabs value={0} onChange={() => {}}>
      <Tab label="Overview" />
    </Tabs>
  );
};

const BadgeTabsExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange}>
      <Tab label="Overview" />
      <Tab label="Notifications" badgeContent={3} showBadge={true} />
      <Tab label="Messages" badgeContent={7} showBadge={true} />
    </Tabs>
  );
};

const InspectionTabExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange}>
      <Tab label="Dashboard" />
      <Tab label="Inspection (3D tour)" badgeContent={3} showBadge={true} />
      <Tab label="Settings" />
    </Tabs>
  );
};

const DisabledTabExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange}>
      <Tab label="Overview" />
      <Tab label="Details" />
      <Tab label="Admin" disabled />
    </Tabs>
  );
};

const CustomIndicatorExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} customIndicatorColor="#FF5722" indicatorWidth={20}>
      <Tab label="Overview" />
      <Tab label="Details" />
      <Tab label="Analytics" />
    </Tabs>
  );
};

const ScrollableTabsExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '500px' }}>
      <Tabs value={value} onChange={handleChange} scrollable showScrollButtons>
        <Tab label="Overview" />
        <Tab label="Inspection (3D tour)" />
        <Tab label="Environment & Recipes" />
        <Tab label="Inventory" />
        <Tab label="Devices" />
        <Tab label="Settings" />
        <Tab label="Analytics" />
      </Tabs>
    </Box>
  );
};

// Example from the reference design
const TabGroupExample = () => {
  const [value, setValue] = React.useState('overview');
  
  const tabs = [
    { label: 'Overview', id: 'overview' },
    { label: 'Environment & Recipes', id: 'environment' },
    { label: 'Inventory', id: 'inventory' },
    { label: 'Devices', id: 'devices' },
  ];

  const handleChange = (_event: React.SyntheticEvent, newValue: string | number) => {
    setValue(newValue as string);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px' }}>
      <TabGroup
        tabs={tabs}
        value={value}
        onChange={handleChange}
        scrollable
        showScrollButtons
      />
    </Box>
  );
};

const TabGroupWithBadgesExample = () => {
  const [value, setValue] = React.useState('overview');
  
  const tabs = [
    { label: 'Overview', id: 'overview' },
    { label: 'Inspection (3D tour)', id: 'inspection', badgeContent: 3 },
    { label: 'Environment & Recipes', id: 'environment' },
    { label: 'Inventory', id: 'inventory', badgeContent: 5 },
    { label: 'Devices', id: 'devices' },
  ];

  const handleChange = (_event: React.SyntheticEvent, newValue: string | number) => {
    setValue(newValue as string);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px' }}>
      <TabGroup
        tabs={tabs}
        value={value}
        onChange={handleChange}
        scrollable
        showScrollButtons
      />
    </Box>
  );
};

const MobileTabGroupExample = () => {
  const [value, setValue] = React.useState('overview');
  
  const tabs = [
    { label: 'Overview', id: 'overview' },
    { label: 'Environment & Recipes', id: 'environment' },
    { label: 'Inventory', id: 'inventory' },
    { label: 'Devices', id: 'devices' },
  ];

  const handleChange = (_event: React.SyntheticEvent, newValue: string | number) => {
    setValue(newValue as string);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '320px' }}>
      <TabGroup
        tabs={tabs}
        value={value}
        onChange={handleChange}
        scrollable
        showScrollButtons
      />
    </Box>
  );
};

// Example from the reference design - Exact match to the reference image
const ReferenceDesignTabsExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '400px' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        equalWidth
        customIndicatorColor="#3545EE"
      >
        <Tab label="Week" isFirst />
        <Tab label="Month" />
        <Tab label="Quarter" />
        <Tab label="Year" isLast />
      </Tabs>
    </Box>
  );
};

// Example using TabGroup for the reference design
const ReferenceDesignTabGroupExample = () => {
  const [value, setValue] = React.useState('week');
  
  const tabs = [
    { label: 'Week', id: 'week' },
    { label: 'Month', id: 'month' },
    { label: 'Quarter', id: 'quarter' },
    { label: 'Year', id: 'year' },
  ];

  const handleChange = (_event: React.SyntheticEvent, newValue: string | number) => {
    setValue(newValue as string);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '400px' }}>
      <TabGroup
        tabs={tabs}
        value={value}
        onChange={handleChange}
        equalWidth
        indicatorColor="#3545EE"
      />
    </Box>
  );
};

const ResponsiveTabsExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Container that responds to different viewport sizes
  const containerStyle = {
    width: '100%', 
    maxWidth: '400px',
    '@media (max-width: 600px)': {
      maxWidth: '300px',
    },
    '@media (max-width: 400px)': {
      maxWidth: '250px',
    }
  };

  return (
    <Box sx={containerStyle}>
      <Tabs
        value={value}
        onChange={handleChange}
        equalWidth
        customIndicatorColor="#3545EE"
      >
        <Tab label="Week" isFirst />
        <Tab label="Month" />
        <Tab label="Quarter" />
        <Tab label="Year" isLast />
      </Tabs>
    </Box>
  );
};

const meta: Meta<typeof Tab> = {
  title: 'UI/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {
  render: () => <DefaultTabsExample />
};

export const Selected: Story = {
  render: () => <SelectedTabExample />
};

export const WithBadge: Story = {
  render: () => <BadgeTabsExample />
};

export const InspectionTab: Story = {
  render: () => <InspectionTabExample />
};

export const Disabled: Story = {
  render: () => <DisabledTabExample />
};

export const CustomIndicator: Story = {
  render: () => <CustomIndicatorExample />
};

export const ScrollableTabs: Story = {
  render: () => <ScrollableTabsExample />,
  parameters: {
    layout: 'fullscreen',
  }
};

export const DesignReferenceTabGroup: Story = {
  render: () => <TabGroupExample />,
  parameters: {
    layout: 'fullscreen',
  }
};

export const TabGroupWithBadges: Story = {
  render: () => <TabGroupWithBadgesExample />,
  parameters: {
    layout: 'fullscreen',
  }
};

export const MobileTabGroup: Story = {
  render: () => <MobileTabGroupExample />,
  parameters: {
    layout: 'fullscreen',
  }
};

// New stories that match the reference design
export const ReferenceDesignTabs: Story = {
  render: () => <ReferenceDesignTabsExample />,
  parameters: {
    layout: 'centered',
  }
};

export const ReferenceDesignTabGroup: Story = {
  render: () => <ReferenceDesignTabGroupExample />,
  parameters: {
    layout: 'centered',
  }
};

export const ResponsiveTabs: Story = {
  render: () => <ResponsiveTabsExample />,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'mobile1',
    },
  }
};