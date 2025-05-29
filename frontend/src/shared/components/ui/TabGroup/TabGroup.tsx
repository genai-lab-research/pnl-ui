import React from 'react';
import { Box, Paper, styled } from '@mui/material';

// Define the Tab item interface
export interface TabItem {
  label: string;
  value: string;
}

// Define the TabGroup props interface
export interface TabGroupProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Styled components
const TabContainer = styled(Paper)(() => ({
  backgroundColor: '#F5F5F5', // Light gray background
  borderRadius: '6px',
  display: 'flex',
  padding: '4px',
  width: '100%',
}));

const TabButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ isActive }) => ({
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  textAlign: 'center',
  flex: 1,
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  letterSpacing: 0,
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: isActive ? '#090B0B' : 'rgba(68, 68, 76, 0.87)', // Dark text for active, gray for inactive
  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
  boxShadow: isActive ? '0px 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
  '&:hover': {
    backgroundColor: isActive ? '#FFFFFF' : 'rgba(0, 0, 0, 0.04)',
  },
  '@media (max-width: 600px)': {
    padding: '4px 8px',
    fontSize: '12px',
  },
}));

/**
 * TabGroup component provides a group of tabs with active/inactive states.
 * It displays tabs in a horizontal bar with proper styling and allows for tab selection.
 */
export const TabGroup: React.FC<TabGroupProps> = ({ 
  tabs, 
  value, 
  onChange, 
  className 
}) => {
  const handleTabChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <TabContainer className={className}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.value}
          isActive={tab.value === value}
          onClick={() => handleTabChange(tab.value)}
          role="tab"
          aria-selected={tab.value === value}
          tabIndex={tab.value === value ? 0 : -1}
        >
          {tab.label}
        </TabButton>
      ))}
    </TabContainer>
  );
};

export default TabGroup;