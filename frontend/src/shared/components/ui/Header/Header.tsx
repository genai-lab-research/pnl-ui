import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Talk2DBButton } from '../icons/Talk2DBButton';

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

const StyledTalk2DBButton = styled(Button)({
  backgroundColor: 'transparent',
  border: 'none',
  padding: 0,
  minWidth: 'auto',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    opacity: 0.8,
  },
});

interface HeaderProps {
  logoText?: string;
  userAvatarSrc?: string;
  userName?: string;
  onTalk2DBClick?: () => void;
  isChatOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  logoText = 'Control Panel',
  userAvatarSrc,
  userName = 'User',
  onTalk2DBClick,
  isChatOpen = false,
}) => {
  return (
    <StyledAppBar position="sticky" sx={{zIndex: 1}}>
      <StyledToolbar>
        <Logo variant="h6">
          {logoText}
        </Logo>
        <UserSection>
          <StyledTalk2DBButton 
            onClick={onTalk2DBClick} 
            aria-label="Talk2DB"
          >
            <Talk2DBButton isOpen={isChatOpen} />
          </StyledTalk2DBButton>
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