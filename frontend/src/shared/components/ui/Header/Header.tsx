import React from 'react';
import BotIcon from '../../../../assets/Bot.png';
import {
  StyledAppBar,
  StyledToolbar,
  Logo,
  UserSection,
  Talk2DBButton,
  StyledAvatar
} from './Header.styles';



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
          <StyledAvatar
            src={userAvatarSrc}
            alt={userName}
          >
            {userName.charAt(0).toUpperCase()}
          </StyledAvatar>
        </UserSection>
      </StyledToolbar>
    </StyledAppBar>
  );
};