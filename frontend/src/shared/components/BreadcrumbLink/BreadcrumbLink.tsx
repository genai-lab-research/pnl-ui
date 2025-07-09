import React from 'react';
import { Container, Text, IconContainer } from './styles';
import { BreadcrumbLinkProps } from './types';
import { ArrowForwardIcon } from './icons';

/**
 * BreadcrumbLink Component
 * 
 * A breadcrumb-style navigation component used in the Vertical Farming Control Panel.
 * It displays a path with a back arrow icon and text formatted like "Container Management / farm-container-04".
 * Used for navigation in the vertical farming control panel.
 */
export const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({ 
  path,
  className,
  onClick
}) => {
  return (
    <Container className={className} onClick={onClick}>
      <IconContainer>
        <ArrowForwardIcon />
      </IconContainer>
      <Text>{path}</Text>
    </Container>
  );
};