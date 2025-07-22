import styled from '@emotion/styled';

export const HeaderContainer = styled.div<{ expanded?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.expanded ? '12px 24px' : '0'};
  height: ${props => props.expanded ? '64px' : '36px'};
  width: ${props => props.expanded ? '100%' : '372px'};
  background-color: ${props => props.expanded ? '#FFFFFF' : 'transparent'};
  border-bottom: ${props => props.expanded ? '1px solid #E5E7EB' : 'none'};
  box-sizing: border-box;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const BotIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 24px;
    height: 24px;
    filter: none; /* Ensure the icon displays in its original colors */
  }
  
  svg {
    width: 24px;
    height: 24px;
    fill: #000000;
  }
`;

export const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #000000;
  letter-spacing: -0.75px;
  line-height: 36px;
  margin: 0;
  white-space: nowrap;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const IconButton = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.7;
  }
  
  &:active {
    opacity: 0.5;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;