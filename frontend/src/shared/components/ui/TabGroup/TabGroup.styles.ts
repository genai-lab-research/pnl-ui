import styled from '@emotion/styled';

export const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 280px;
  height: 32px;
  border: 1px solid #9747FF;
  border-radius: 5px;
`;

interface TabItemProps {
  isSelected: boolean;
}

export const TabItem = styled.button<TabItemProps>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  height: 100%;
  border: none;
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
  border: ${({ isSelected }) => isSelected ? '1px solid #3545EE' : 'none'};

  &:focus {
    outline: none;
  }
`;

export const TabContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;
