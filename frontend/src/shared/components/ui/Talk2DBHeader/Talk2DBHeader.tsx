import React from 'react';
import {
  HeaderContainer,
  LeftSection,
  BotIconWrapper,
  Title,
  RightSection,
  IconButton
} from './styles';
import { ExpandIcon, CloseIcon } from './icons';
import { Talk2DBHeaderProps } from './types';
import BotIcon from '../../../../assets/Bot.png';

export const Talk2DBHeader: React.FC<Talk2DBHeaderProps> = ({
  title = 'Talk2DB',
  onExpand,
  onClose,
  showBotIcon = true,
  className,
  expanded = false
}) => {
  return (
    <HeaderContainer className={className} expanded={expanded}>
      <LeftSection>
        {showBotIcon && (
          <BotIconWrapper>
            <img src={BotIcon} alt="Bot" width={24} height={24} />
          </BotIconWrapper>
        )}
        <Title>{title}</Title>
      </LeftSection>
      
      <RightSection>
        {onExpand && (
          <IconButton 
            onClick={onExpand}
            aria-label="Expand"
            type="button"
          >
            <ExpandIcon />
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
    </HeaderContainer>
  );
};