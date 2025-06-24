import React from 'react';
import { Container, Text, IconWrapper } from './styles';
import { NavigationLinkProps } from './types';
import ArrowForwardIcon from './icons/ArrowForwardIcon';

/**
 * NavigationLink Component
 * 
 * A "generation-block" wrapper used in the Vertical Farming Control Panel.
 * It displays text with a forward arrow icon for navigation purposes.
 */
export const NavigationLink: React.FC<NavigationLinkProps> = ({ 
  text,
  className,
  onClick
}) => {
  return (
    <Container className={className} onClick={onClick}>
      <Text>{text}</Text>
      <IconWrapper>
        <ArrowForwardIcon />
      </IconWrapper>
    </Container>
  );
};
