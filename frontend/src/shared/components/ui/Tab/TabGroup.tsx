import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Tabs, Tab } from './index';
import { useIsMobile } from '../../../utils/responsive';

export interface TabItem {
  /** Label shown on the tab */
  label: string;
  /** Optional badge number */
  badgeContent?: number;
  /** Unique identifier for the tab */
  id: string | number;
  /** If true, tab will be disabled */
  disabled?: boolean;
}

export interface TabGroupProps {
  /** Array of tab items to display */
  tabs: TabItem[];
  /** The value of the currently selected tab */
  value: string | number;
  /** Callback fired when the value changes */
  onChange: (event: React.SyntheticEvent, value: number | string) => void;
  /** If true, tabs will automatically scroll when necessary */
  scrollable?: boolean;
  /** If true, will show navigation arrows when scrollable */
  showScrollButtons?: boolean;
  /** Custom color for the indicator */
  indicatorColor?: string;
  /** If true, tabs will have equal width in their container */
  equalWidth?: boolean;
  /** If true, the first tab will have rounded corners on the left side */
  roundedFirstTab?: boolean;
  /** If true, the last tab will have rounded corners on the right side */
  roundedLastTab?: boolean;
  /** Optional override class name */
  className?: string;
}

const TabGroupContainer = styled(Box)(() => ({
  width: '100%',
  overflow: 'hidden',
}));

/**
 * TabGroup component for displaying a group of tabs based on the Material Design specifications.
 * This component follows the design shown in the reference image and provides responsive behavior.
 * 
 * @component
 * @example
 * ```tsx
 * const tabs = [
 *   { label: 'Week', id: 'week' },
 *   { label: 'Month', id: 'month' },
 *   { label: 'Quarter', id: 'quarter' },
 *   { label: 'Year', id: 'year' }
 * ];
 * 
 * const [value, setValue] = React.useState('week');
 * const handleChange = (event, newValue) => {
 *   setValue(newValue);
 * };
 * 
 * return (
 *   <TabGroup 
 *     tabs={tabs}
 *     value={value}
 *     onChange={handleChange}
 *     equalWidth
 *   />
 * );
 * ```
 */
export const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  value,
  onChange,
  scrollable = true,
  showScrollButtons = false,
  indicatorColor = '#3545EE',
  equalWidth = false,
  roundedFirstTab = true,
  roundedLastTab = true,
  className,
}) => {
  const isMobile = useIsMobile();

  return (
    <TabGroupContainer className={className}>
      <Tabs
        value={value}
        onChange={onChange}
        scrollable={scrollable}
        showScrollButtons={showScrollButtons}
        customIndicatorColor={indicatorColor}
        equalWidth={equalWidth}
        roundedFirstTab={roundedFirstTab}
        roundedLastTab={roundedLastTab}
        variant="scrollable"
        aria-label="tab group"
      >
        {tabs.map((tab, index) => (
          <Tab
            key={tab.id}
            label={tab.label}
            value={tab.id}
            disabled={tab.disabled}
            badgeContent={tab.badgeContent}
            showBadge={!!tab.badgeContent}
            customIndicatorColor={indicatorColor}
            isFirst={index === 0 && roundedFirstTab}
            isLast={index === tabs.length - 1 && roundedLastTab}
            equalWidth={equalWidth}
            sx={{ 
              padding: isMobile ? '8px 12px' : '12px 16px',
            }}
          />
        ))}
      </Tabs>
    </TabGroupContainer>
  );
};

export default TabGroup;