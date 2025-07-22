import styled from '@emotion/styled';

export const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 436px;
  height: 48px;
  align-items: flex-end;
  position: relative;
`;

interface TabItemProps {
  isSelected: boolean;
}

export const TabItem = styled.button<TabItemProps>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 14px ${({ isSelected }) => isSelected ? '16px' : '16px'};
  border: none;
  background: none;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  text-align: center;
  color: ${({ isSelected }) => isSelected ? '#3545EE' : '#49454F'};

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: rgba(53, 69, 238, 0.04);
  }
`;

export const TabContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 20px;
`;

export const Indicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3545EE;
  width: 100%;
`;
