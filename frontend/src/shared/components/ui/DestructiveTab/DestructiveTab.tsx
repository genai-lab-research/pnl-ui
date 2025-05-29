import React from 'react';
import { Tab as MuiTab, TabProps as MuiTabProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useIsMobile } from '../../../utils/responsive';

export interface DestructiveTabProps extends Omit<MuiTabProps, 'variant'> {
  /**
   * The label content of the tab.
   */
  label: React.ReactNode;
  
  /**
   * If `true`, the tab will be disabled.
   */
  disabled?: boolean;
  
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
    !['customIndicatorColor', 'isMobile', 'isFirst', 'isLast', 'equalWidth'].includes(prop as string),
})<StyledTabProps>(({ theme, customIndicatorColor, isMobile, equalWidth }) => ({
  textTransform: 'none',
  minWidth: 0,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0.1px',
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  color: 'rgba(68, 68, 76, 0.87)',
  padding: '6px 12px',
  // Add smaller padding on mobile
  ...(isMobile && {
    padding: '6px 10px',
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
  // Add shadow effect as shown in the reference image
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
}));

/**
 * DestructiveTab component for configuring actions in navigation and content organization.
 * This component is based on the Material UI Tab component with custom styling to match the design.
 * 
 * @component
 * @example
 * ```tsx
 * <Tabs value={value} onChange={handleChange}>
 *   <DestructiveTab label="Configuring" />
 * </Tabs>
 * ```
 */
export const DestructiveTab: React.FC<DestructiveTabProps> = ({
  label,
  disabled = false,
  customIndicatorColor,
  isFirst = false,
  isLast = false,
  equalWidth = false,
  ...props
}) => {
  const isMobile = useIsMobile();

  return (
    <StyledTab
      label={label}
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

export default DestructiveTab;