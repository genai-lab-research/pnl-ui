import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import { Tabs, Tab } from '../Tab';
import { useIsMobile } from '../../../utils/responsive';

export type ViewMode = 'list' | 'grid';

export interface TabOption {
  label: string;
  value: string | number;
}

export interface ViewToggleTabsProps {
  /**
   * The currently selected value
   */
  value: string | number;
  
  /**
   * Callback fired when the selection changes
   */
  onChange: (event: React.SyntheticEvent, newValue: string | number) => void;
  
  /**
   * Array of tab options (if not provided, defaults to list/grid view)
   */
  options?: TabOption[];
  
  /**
   * Custom color for the active tab background
   */
  activeBackgroundColor?: string;
  
  /**
   * Custom color for the active icon
   */
  activeIconColor?: string;
  
  /**
   * Custom color for the inactive icon
   */
  inactiveIconColor?: string;
  
  /**
   * Custom class name applied to the root element
   */
  className?: string;
}

const ViewToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderRadius: '4px',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
}));

const IconTab = styled(Tab)<{ 
  active: boolean;
  activeBackgroundColor?: string;
  activeIconColor?: string;
  inactiveIconColor?: string;
}>(({ 
  theme, 
  active, 
  activeBackgroundColor = '#FFFFFF',
  activeIconColor = '#455168',
  inactiveIconColor = '#FFFFFF'
}) => ({
  minWidth: '40px',
  minHeight: '40px',
  padding: '8px',
  backgroundColor: active ? activeBackgroundColor : 'transparent',
  color: active ? activeIconColor : inactiveIconColor,
  '&:hover': {
    backgroundColor: active ? activeBackgroundColor : 'rgba(0, 0, 0, 0.04)',
  },
  '& .MuiTab-iconWrapper': {
    margin: 0,
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: '36px',
    minHeight: '36px',
    padding: '6px',
  },
}));

const TextTab = styled(Tab)<{ 
  active: boolean;
  activeBackgroundColor?: string;
  activeIconColor?: string;
  inactiveIconColor?: string;
}>(({ 
  theme, 
  active, 
  activeBackgroundColor = '#FFFFFF',
  activeIconColor = '#455168',
  inactiveIconColor = '#FFFFFF'
}) => ({
  color: 'black',
  minHeight: '40px',
  padding: '8px 16px',
  backgroundColor: active ? activeBackgroundColor : 'transparent',
  // color: active ? activeIconColor : inactiveIconColor,
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: active ? activeBackgroundColor : 'rgba(0, 0, 0, 0.04)',
  },
  '& .MuiTab-iconWrapper': {
    margin: 0,
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '36px',
    padding: '6px 12px',
  },
}));

/**
 * ViewToggleTabs component for switching between different view modes or custom options.
 * The component can display icon buttons (for list/grid) or text tabs (for custom options).
 * 
 * @component
 * @example
 * ```tsx
 * // Default list/grid view
 * const [viewMode, setViewMode] = React.useState<ViewMode>('list');
 * const handleViewChange = (event: React.SyntheticEvent, newMode: ViewMode) => {
 *   setViewMode(newMode);
 * };
 * return (
 *   <ViewToggleTabs value={viewMode} onChange={handleViewChange} />
 * );
 * 
 * // Custom options
 * const [viewMode, setViewMode] = React.useState('nursery');
 * const handleViewChange = (event: React.SyntheticEvent, newValue: string | number) => {
 *   setViewMode(newValue);
 * };
 * return (
 *   <ViewToggleTabs 
 *     value={viewMode} 
 *     onChange={handleViewChange}
 *     options={[
 *       { label: 'Nursery Station', value: 'nursery' },
 *       { label: 'Cultivation Area', value: 'cultivation' }
 *     ]}
 *   />
 * );
 * ```
 */
export const ViewToggleTabs: React.FC<ViewToggleTabsProps> = ({
  value,
  onChange,
  options,
  activeBackgroundColor = '#FFFFFF',
  activeIconColor = '#455168',
  inactiveIconColor = '#FFFFFF',
  className,
}) => {
  const isMobile = useIsMobile();

  // Use default list/grid options if none provided
  const defaultOptions: TabOption[] = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' }
  ];
  
  const tabOptions = options || defaultOptions;
  const isDefaultMode = !options;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const selectedOption = tabOptions[newValue];
    if (selectedOption) {
      onChange(event, selectedOption.value);
    }
  };

  const currentIndex = tabOptions.findIndex(option => option.value === value);
  const validIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <ViewToggleContainer className={className}>
      <Tabs
        value={validIndex}
        onChange={handleChange}
        indicatorColor="transparent"
        sx={{
          minHeight: isMobile ? '36px' : '40px',
          '& .MuiTabs-flexContainer': {
            height: '100%',
          },
        }}
      >
        {isDefaultMode ? (
          // Render icon tabs for default list/grid mode
          <>
            <IconTab
              value={0}
              icon={<ViewListIcon fontSize={isMobile ? 'small' : 'medium'} />}
              label=""
              disableRipple
              active={value === 'list'}
              activeBackgroundColor={activeBackgroundColor}
              activeIconColor={activeIconColor}
              inactiveIconColor={inactiveIconColor}
              aria-label="list view"
            />
            <IconTab
              value={1}
              icon={<GridViewIcon fontSize={isMobile ? 'small' : 'medium'} />}
              label=""
              disableRipple
              active={value === 'grid'}
              activeBackgroundColor={activeBackgroundColor}
              activeIconColor={activeIconColor}
              inactiveIconColor={inactiveIconColor}
              aria-label="grid view"
            />
          </>
        ) : (
          // Render text tabs for custom options
          tabOptions.map((option, index) => (
            <TextTab
              key={option.value}
              value={index}
              label={option.label}
              disableRipple
              active={value === option.value}
              activeBackgroundColor={activeBackgroundColor}
              activeIconColor={activeIconColor}
              inactiveIconColor={inactiveIconColor}
              aria-label={option.label}
            />
          ))
        )}
      </Tabs>
    </ViewToggleContainer>
  );
};

export default ViewToggleTabs;