import React from 'react';
import { Tab as MuiTab, TabProps as MuiTabProps, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useIsMobile } from '../../../utils/responsive';

export interface TabProps extends Omit<MuiTabProps, 'variant'> {
  /**
   * The label content of the tab.
   */
  label: React.ReactNode;
  
  /**
   * If `true`, the tab will be disabled.
   */
  disabled?: boolean;
  
  /**
   * If provided, a badge will be shown with this content.
   */
  badgeContent?: React.ReactNode;
  
  /**
   * If `true`, the badge will be shown.
   */
  showBadge?: boolean;
  
  /**
   * Custom style override for indicator color
   */
  customIndicatorColor?: string;
  
  /**
   * If `true`, this tab is the first tab in the group
   */
  isFirst?: boolean;
  
  /**
   * If `true`, this tab is the last tab in the group
   */
  isLast?: boolean;
  
  /**
   * If `true`, tabs will have equal width in their container
   */
  equalWidth?: boolean;
}

// Define the props that we'll pass to the styled component
interface StyledTabProps {
  customIndicatorColor?: string;
  isMobile?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  equalWidth?: boolean;
}

const StyledTab = styled(MuiTab, {
  shouldForwardProp: (prop) => 
    !['customIndicatorColor', 'showBadge', 'badgeContent', 'isMobile', 'isFirst', 'isLast', 'equalWidth'].includes(prop as string),
})<StyledTabProps>(({ theme, customIndicatorColor, isMobile, isFirst, isLast, equalWidth }) => ({
  textTransform: 'none',
  minWidth: 0,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0.1px',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  color: '#49454F',
  padding: '8px 16px',
  // Add smaller padding on mobile
  ...(isMobile && {
    padding: '8px 12px',
  }),
  // Make tab flex grow if equal width is desired
  ...(equalWidth && {
    flex: 1,
  }),
  '&.Mui-selected': {
    color: customIndicatorColor || '#3545EE',
    fontWeight: 500,
  },
  '&.Mui-disabled': {
    color: theme.palette.text.disabled,
  },
  '&:hover': {
    // Subtle hover effect
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

/**
 * Tab component used in navigation and content organization.
 * The component follows Material Design guidelines and adapts to different screen sizes.
 * 
 * @component
 * @example
 * ```tsx
 * <Tabs value={value} onChange={handleChange}>
 *   <Tab label="Week" />
 *   <Tab label="Month" />
 *   <Tab label="Quarter" />
 *   <Tab label="Year" />
 * </Tabs>
 * ```
 */
export const Tab: React.FC<TabProps> = ({
  label,
  disabled = false,
  badgeContent,
  showBadge = false,
  customIndicatorColor,
  isFirst = false,
  isLast = false,
  equalWidth = false,
  ...props
}) => {
  const isMobile = useIsMobile();

  // Render the label with a badge if showBadge is true and badgeContent is provided
  const renderLabel = () => {
    if (showBadge && badgeContent) {
      return (
        <Badge 
          badgeContent={badgeContent} 
          color="error" 
          sx={{ 
            '& .MuiBadge-badge': {
              right: -8,
              top: -6,
              minWidth: '16px',
              height: '16px',
              fontSize: '10px',
              backgroundColor: '#B3261E',
              padding: '0 4px',
              // Slightly adjust badge on mobile
              ...(isMobile && {
                right: -6,
                minWidth: '14px',
                height: '14px',
                fontSize: '9px',
              }),
            }
          }}
        >
          {label}
        </Badge>
      );
    }
    return label;
  };

  return (
    <StyledTab
      label={renderLabel()}
      disabled={disabled}
      customIndicatorColor={customIndicatorColor}
      disableRipple
      isMobile={isMobile}
      isFirst={isFirst}
      isLast={isLast}
      equalWidth={equalWidth}
      {...props}
    />
  );
};

export default Tab;