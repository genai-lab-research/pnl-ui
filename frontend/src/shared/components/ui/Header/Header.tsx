import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#000000',
  boxShadow: 'none',
  borderBottom: '1px solid #E5E7EB',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: '64px !important',
  paddingLeft: '24px',
  paddingRight: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Logo = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '20px',
  fontWeight: 700,
  color: '#000000',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
  },
});

const UserSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

interface HeaderProps {
  logoText?: string;
  userAvatarSrc?: string;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logoText = 'Control Panel',
  userAvatarSrc,
  userName = 'User',
}) => {
  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        <Logo variant="h6">
          {logoText}
        </Logo>
        <UserSection>
          <Avatar
            src={userAvatarSrc}
            alt={userName}
            sx={{
              width: 32,
              height: 32,
              backgroundColor: '#4C4E64',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
        </UserSection>
      </StyledToolbar>
    </StyledAppBar>
  );
};