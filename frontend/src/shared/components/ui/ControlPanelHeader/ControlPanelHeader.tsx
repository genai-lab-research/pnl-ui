import React from 'react';
import { Box, Typography, AppBar, Toolbar, styled } from '@mui/material';
import Avatar from '../Avatar/Avatar';

export interface ControlPanelHeaderProps {
  /**
   * The title to display in the header
   */
  title?: string;
  /**
   * The avatar image source URL. If not provided, a default avatar will be shown.
   */
  avatarSrc?: string;
  /**
   * Additional CSS class name
   */
  className?: string;
}

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: '#FFFFFF',
  color: '#000000',
  boxShadow: 'none',
  borderBottom: '1px solid #E5E7EB',
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 24px',
  minHeight: '64px',
});

const StyledTitle = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '28px',
});

/**
 * ControlPanelHeader component displays a horizontal bar at the top of the page with a title and user avatar.
 * It follows Material Design guidelines with a clean, minimal appearance.
 * 
 * @component
 * @example
 * ```tsx
 * <ControlPanelHeader title="Control Panel" avatarSrc="/path/to/avatar.jpg" />
 * ```
 */
export const ControlPanelHeader: React.FC<ControlPanelHeaderProps> = ({ 
  title = 'Control Panel', 
  avatarSrc,
  className 
}) => {
  return (
    <StyledAppBar position="static" className={className}>
      <StyledToolbar>
        <StyledTitle variant="h1">{title}</StyledTitle>
        <Box>
          <Avatar src={avatarSrc} alt="User Avatar" size="medium" variant="circular" />
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default ControlPanelHeader;
