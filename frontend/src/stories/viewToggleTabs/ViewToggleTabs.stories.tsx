import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ViewToggleTabs, ViewMode } from '../../shared/components/ui/ViewToggleTabs';
import { Box } from '@mui/material';

// Create wrapper component for state management
const ViewToggleTabsExample = () => {
  const [view, setView] = React.useState<ViewMode>('list');

  const handleViewChange = (_event: React.SyntheticEvent, newView: ViewMode) => {
    setView(newView);
  };

  return (
    <ViewToggleTabs
      value={view}
      onChange={handleViewChange}
    />
  );
};

const GridPreselectedExample = () => {
  const [view, setView] = React.useState<ViewMode>('grid');

  const handleViewChange = (_event: React.SyntheticEvent, newView: ViewMode) => {
    setView(newView);
  };

  return (
    <ViewToggleTabs
      value={view}
      onChange={handleViewChange}
    />
  );
};

const CustomColorsExample = () => {
  const [view, setView] = React.useState<ViewMode>('list');

  const handleViewChange = (_event: React.SyntheticEvent, newView: ViewMode) => {
    setView(newView);
  };

  return (
    <ViewToggleTabs
      value={view}
      onChange={handleViewChange}
      activeBackgroundColor="#1976d2"
      activeIconColor="#ffffff"
      inactiveIconColor="#1976d2"
    />
  );
};

// Example that exactly matches the reference design
const ReferenceDesignExample = () => {
  const [view, setView] = React.useState<ViewMode>('list');

  const handleViewChange = (_event: React.SyntheticEvent, newView: ViewMode) => {
    setView(newView);
  };

  return (
    <ViewToggleTabs
      value={view}
      onChange={handleViewChange}
      activeBackgroundColor="#455168"
      activeIconColor="#FFFFFF"
      inactiveIconColor="#455168"
    />
  );
};

// Example that shows the component on a dark background
const DarkBackgroundExample = () => {
  const [view, setView] = React.useState<ViewMode>('list');

  const handleViewChange = (_event: React.SyntheticEvent, newView: ViewMode) => {
    setView(newView);
  };

  return (
    <Box sx={{ backgroundColor: '#202124', padding: 2, borderRadius: 1 }}>
      <ViewToggleTabs
        value={view}
        onChange={handleViewChange}
        activeBackgroundColor="#455168"
        activeIconColor="#FFFFFF"
        inactiveIconColor="#E0E0E0"
      />
    </Box>
  );
};

// Example showing content that changes based on the selected view
const WithContentExample = () => {
  const [view, setView] = React.useState<ViewMode>('list');

  const handleViewChange = (_event: React.SyntheticEvent, newView: ViewMode) => {
    setView(newView);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <ViewToggleTabs
          value={view}
          onChange={handleViewChange}
        />
      </Box>
      
      {view === 'list' ? (
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, padding: 2 }}>
          <Box sx={{ display: 'flex', borderBottom: '1px solid #e0e0e0', padding: 1, marginBottom: 1 }}>
            <Box sx={{ width: '70%' }}>Item Name</Box>
            <Box sx={{ width: '30%' }}>Status</Box>
          </Box>
          {['Item 1', 'Item 2', 'Item 3'].map((item) => (
            <Box key={item} sx={{ display: 'flex', padding: 1, borderBottom: '1px solid #f5f5f5' }}>
              <Box sx={{ width: '70%' }}>{item}</Box>
              <Box sx={{ width: '30%' }}>Active</Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {['Item 1', 'Item 2', 'Item 3'].map((item) => (
            <Box 
              key={item}
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box sx={{ backgroundColor: '#f5f5f5', width: 60, height: 60, borderRadius: 1, marginBottom: 1 }} />
              <Box>{item}</Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Active</Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const meta: Meta<typeof ViewToggleTabs> = {
  title: 'UI/ViewToggleTabs',
  component: ViewToggleTabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ViewToggleTabs>;

export const Default: Story = {
  render: () => <ViewToggleTabsExample />
};

export const GridPreselected: Story = {
  render: () => <GridPreselectedExample />
};

export const CustomColors: Story = {
  render: () => <CustomColorsExample />
};

export const ReferenceDesign: Story = {
  render: () => <ReferenceDesignExample />
};

export const DarkBackground: Story = {
  render: () => <DarkBackgroundExample />
};

export const WithContent: Story = {
  render: () => <WithContentExample />,
  parameters: {
    layout: 'padded',
  }
};