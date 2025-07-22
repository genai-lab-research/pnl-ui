import React from 'react';
import {
  HeaderContainer,
  LeftSection,
  BotIcon as BotIconWrapper,
  Title,
  RightSection,
  IconButton,
  Divider
} from './styles';
import { BotIcon, MinimizeIcon, CloseIcon } from './icons';
import { ChatHeaderProps } from './types';

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = 'Talk2DB',
  onMinimize,
  onClose,
  showBotIcon = true
}) => {
  return (
    <HeaderContainer>
      <LeftSection>
        {showBotIcon && (
          <BotIconWrapper>
            <BotIcon />
          </BotIconWrapper>
        )}
        <Title>{title}</Title>
      </LeftSection>
      
      <RightSection>
        {onMinimize && (
          <IconButton 
            onClick={onMinimize}
            aria-label="Minimize"
            type="button"
          >
            <MinimizeIcon />
          </IconButton>
        )}
        {onClose && (
          <IconButton 
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <CloseIcon />
          </IconButton>
        )}
      </RightSection>
      
      <Divider />
    </HeaderContainer>
  );
};