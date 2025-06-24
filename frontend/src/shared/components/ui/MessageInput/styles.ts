import styled from '@emotion/styled';

export const MessageInputContainer = styled.div`
  display: flex;
  align-items: center;
  background: #FDFDFD;
  border-radius: 8px;
  padding: 12px 12px 12px 25px;
  gap: 12px;
  box-shadow: 
    0px 1.44px 2.21px rgba(28, 42, 71, 0.03),
    0px 3.46px 5.32px rgba(28, 42, 71, 0.04),
    0px 6.51px 10.02px rgba(28, 42, 71, 0.05),
    0px 11.61px 17.87px rgba(28, 42, 71, 0.06),
    0px 21.72px 33.42px rgba(28, 42, 71, 0.07),
    0px 52px 80px rgba(28, 42, 71, 0.08);
  width: 100%;
  min-height: 64px;
`;

export const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  color: #1C2A47;
  
  &::placeholder {
    color: #818EA1;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 8px;
  
  &:hover:not(:disabled) {
    background-color: rgba(129, 142, 161, 0.08);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: #3545EE;
  border-radius: 6px;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #2638D9;
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;