import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import { Tabs, Tab } from '../Tab';
import { useIsMobile } from '../../../utils/responsive';

export type ViewMode = 'list' | 'grid';

export interface ViewToggleTabsProps {
  /**
   * The currently selected view mode
   */
  value: ViewMode;
  
  /**
   * Callback fired when the view mode changes
   */
  onChange: (event: React.SyntheticEvent, newValue: ViewMode) => void;
  
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
  activeBackgroundColor = '#455168',
  activeIconColor = '#FFFFFF',
  inactiveIconColor = '#455168'
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

/**
 * ViewToggleTabs component for switching between list and grid view modes.
 * The component displays two icon buttons (list and grid) and allows toggling between them.
 * 
 * @component
 * @example
 * ```tsx
 * const [viewMode, setViewMode] = React.useState<ViewMode>('list');
 * 
 * const handleViewChange = (event: React.SyntheticEvent, newMode: ViewMode) => {
 *   setViewMode(newMode);
 * };
 * 
 * return (
 *   <ViewToggleTabs
 *     value={viewMode}
 *     onChange={handleViewChange}
 *   />
 * );
 * ```
 */
export const ViewToggleTabs: React.FC<ViewToggleTabsProps> = ({
  value,
  onChange,
  activeBackgroundColor = '#455168',
  activeIconColor = '#FFFFFF',
  inactiveIconColor = '#455168',
  className,
}) => {
  const isMobile = useIsMobile();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const viewMode = newValue === 0 ? 'list' : 'grid';
    onChange(event, viewMode);
  };

  return (
    <ViewToggleContainer className={className}>
      <Tabs
        value={value === 'list' ? 0 : 1}
        onChange={handleChange}
        indicatorColor="transparent"
        sx={{
          minHeight: isMobile ? '36px' : '40px',
          '& .MuiTabs-flexContainer': {
            height: '100%',
          },
        }}
      >
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
      </Tabs>
    </ViewToggleContainer>
  );
};

export default ViewToggleTabs;