import styled from 'styled-components';
import { Box } from '@mui/material';

export const PanelWrapper = styled(Box)`
  width: 420px;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const PanelHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
  position: relative;
  z-index: 2;
`;

export const PanelContent = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ScrollableContent = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const SectionSpacer = styled(Box)`
  height: 32px;
`;