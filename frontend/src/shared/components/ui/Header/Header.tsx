import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import BotIcon from '../../../../assets/Bot.png';

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

const Talk2DBButton = styled(Button)({
  backgroundColor: '#4C4E64',
  color: '#FFFFFF',
  textTransform: 'none',
  borderRadius: '6px',
  padding: '6px 12px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  minWidth: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '&:hover': {
    backgroundColor: '#3D3F52',
  },
});

interface HeaderProps {
  logoText?: string;
  userAvatarSrc?: string;
  userName?: string;
  onTalk2DBClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  logoText = 'Control Panel',
  userAvatarSrc,
  userName = 'User',
  onTalk2DBClick,
}) => {
  return (
    <StyledAppBar position="sticky" sx={{zIndex: 1}}>
      <StyledToolbar>
        <Logo variant="h6">
          {logoText}
        </Logo>
        <UserSection>
          <Talk2DBButton 
            onClick={onTalk2DBClick} 
            aria-label="Talk2DB"
            startIcon={<img src={BotIcon} alt="Bot" width={18} height={18} />}
          >
            Talk2DB
          </Talk2DBButton>
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