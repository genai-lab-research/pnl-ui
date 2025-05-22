import React from 'react';
import { Box } from '@mui/material';
import clsx from 'clsx';
import { TabGroup, TabItem } from '../Tab/TabGroup';

export interface TabGroupContainerProps {
  tabs: TabItem[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
  variant?: 'standard' | 'fullWidth' | 'scrollable';
  size?: 'small' | 'medium';
  centered?: boolean;
  ariaLabel?: string;
}

export const TabGroupContainer: React.FC<TabGroupContainerProps> = ({
  tabs,
  value,
  onChange,
  className,
  variant = 'standard',
  size = 'medium',
  centered = false,
  ariaLabel,
}) => {
  return (
    <Box className={clsx('bg-white border-b border-gray-200', className)}>
      <Box className="px-4">
        <TabGroup
          tabs={tabs}
          value={value}
          onChange={onChange}
          variant={variant}
          size={size}
          centered={centered}
          ariaLabel={ariaLabel}
        />
      </Box>
    </Box>
  );
};

export default TabGroupContainer;