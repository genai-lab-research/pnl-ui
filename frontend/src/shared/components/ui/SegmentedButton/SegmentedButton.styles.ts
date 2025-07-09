import styled from '@emotion/styled';

export const SegmentedButtonContainer = styled.div`
  display: flex;
  width: 205px;
  height: 30px;
  border: 1px solid #455168;
  border-radius: 5px;
`;

export const SegmentButtonOption = styled.button<{ isActive: boolean }>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ isActive }) => isActive ? '#455168' : 'transparent'};
  color: ${({ isActive }) => isActive ? '#FFFFFF' : '#455168'};
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  padding: 10px 12px;
  cursor: pointer;
  border: none;
  border-right: ${({ isActive }) => isActive ? 'none' : '1px solid rgba(109, 120, 141, 0.5)'};
  
  &:first-of-type {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  
  &:last-of-type {
    border-right: none;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  
  &:focus {
    outline: none;
  }
`;