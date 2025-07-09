import styled from '@emotion/styled';

export const MediaControlButtonSetContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 144px;
  height: 24px;
`;

export const IconButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: transparent;
  border: 1px solid rgba(73, 69, 79, 0.1);
  border-radius: 3px;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: rgba(73, 69, 79, 0.05);
  }
  
  &:active {
    background-color: rgba(73, 69, 79, 0.1);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  svg {
    width: 14px;
    height: 14px;
    fill: #49454F;
  }
`;