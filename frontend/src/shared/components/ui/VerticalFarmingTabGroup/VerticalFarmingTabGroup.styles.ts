import styled from '@emotion/styled';

export const TabContainer = styled.div`
  display: flex;
  flex-direction: horizontal;
  gap: 10px;
`;

interface TabItemProps {
  isSelected: boolean;
}

export const TabItem = styled.button<TabItemProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: ${({ isSelected }) => isSelected ? '1px solid #3545EE' : '1px solid transparent'};
  border-radius: 4px;
  background: none;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.5px;
  text-align: center;
  color: ${({ isSelected }) => isSelected ? '#3545EE' : '#49454F'};

  &:focus {
    outline: none;
  }
`;

export const TabContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
