import styled from '@emotion/styled';

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F6F7FA;
  padding: 0 24px;
  height: 63px;
  position: relative;
  width: 100%;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BotIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
    fill: #333333;
  }
`;

export const Title = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  letter-spacing: -0.4px;
  line-height: 32px;
  margin: 0;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconButton = styled.button`
  width: 40px;
  height: 40px;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  &:active {
    background-color: rgba(0, 0, 0, 0.08);
  }
  
  svg {
    width: 24px;
    height: 24px;
    fill: #333333;
  }
`;

export const Divider = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #CFD5DC;
`;