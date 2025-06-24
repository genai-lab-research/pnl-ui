import React from 'react';
import { Container, TitleText, IconWrapper } from './styles';
import { VerticalFarmingGeneralInfoBlockProps } from './types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export const VerticalFarmingGeneralInfoBlock: React.FC<VerticalFarmingGeneralInfoBlockProps> = ({
  title,
  isExpanded = false,
  onClick,
  className
}) => {
  return (
    <Container className={className} onClick={onClick}>
      <TitleText>{title}</TitleText>
      <IconWrapper>
        {isExpanded ? 
          <KeyboardArrowUpIcon fontSize="small" style={{ color: '#49454F' }} /> : 
          <KeyboardArrowDownIcon fontSize="small" style={{ color: '#49454F' }} />
        }
      </IconWrapper>
    </Container>
  );
};
