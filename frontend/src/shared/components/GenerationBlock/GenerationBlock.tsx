import React from 'react';
import { Container, LabelText, IconContainer, StatusChip } from './styles';
import { GenerationBlockProps } from './types';
import { ContainerIcon } from './components';

/**
 * GenerationBlock Component
 * 
 * A single-row component displaying container or generation information.
 * Shows an icon, label text, and a status chip.
 * Used in a vertical farming control panel.
 */
export const GenerationBlock: React.FC<GenerationBlockProps> = ({ 
  icon,
  label, 
  status, 
  className 
}) => {
  return (
    <Container className={className}>
      <IconContainer>
        {icon || <ContainerIcon />}
      </IconContainer>
      <LabelText>{label}</LabelText>
      <StatusChip statusType={status.type}>{status.label}</StatusChip>
    </Container>
  );
};
