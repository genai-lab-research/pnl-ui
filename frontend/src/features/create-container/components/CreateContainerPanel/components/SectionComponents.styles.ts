import styled from 'styled-components';
import { Box, Typography } from '@mui/material';

export const SectionWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionTitle = styled(Typography)`
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0;
`;

export const InputGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FieldSpacing = styled(Box)`
  height: 0px;
`;

export const ToggleRow = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const StyledSegmentedButton = styled(Box)`
  display: flex;
  border: 1px solid #455168;
  border-radius: 4px;
  overflow: hidden;
  
  & .segment {
    flex: 1;
    padding: 8px 16px;
    text-align: center;
    cursor: pointer;
    font-family: Inter, sans-serif;
    font-size: 14px;
    font-weight: 400;
    transition: all 0.2s ease;
    border: none;
    background: transparent;
    
    &.active {
      background-color: #455168;
      color: #FFFFFF;
    }
    
    &.inactive {
      background-color: transparent;
      color: #4C4E64;
      border-right: 1px solid #6D788D;
    }
    
    &:last-child {
      border-right: none;
    }
    
    &:disabled {
      background-color: rgba(76, 78, 100, 0.12);
      color: rgba(76, 78, 100, 0.4);
      cursor: not-allowed;
    }
  }
`;