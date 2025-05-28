import React from 'react';

import { Box, Tab, Tabs } from '@mui/material';
import clsx from 'clsx';

export interface TabItem {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface TabGroupProps {
  tabs: TabItem[];
  value: string | number;
  onChange: (value: string | number) => void;
  variant?: 'standard' | 'fullWidth' | 'scrollable';
  size?: 'small' | 'medium';
  className?: string;
  centered?: boolean;
  ariaLabel?: string;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  value,
  onChange,
  variant = 'standard',
  size = 'medium',
  className,
  centered = false,
  ariaLabel = 'Navigation tabs',
}) => {
  const handleChange = (_: React.SyntheticEvent, newValue: string | number) => {
    onChange(newValue);
  };

  return (
    <Box className={clsx('border-b border-gray-200', className)}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant={variant}
        scrollButtons={variant === 'scrollable' ? 'auto' : undefined}
        aria-label={ariaLabel}
        centered={centered}
        className={clsx('min-h-0', size === 'small' ? 'h-9' : 'h-12')}
        TabIndicatorProps={{
          style: {
            backgroundColor: '#1976d2',
            height: 2,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            disabled={tab.disabled}
            className={clsx(
              'min-h-0 font-medium text-gray-600',
              'hover:text-gray-800',
              size === 'small' ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm',
              'capitalize',
            )}
            disableRipple
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default TabGroup;
