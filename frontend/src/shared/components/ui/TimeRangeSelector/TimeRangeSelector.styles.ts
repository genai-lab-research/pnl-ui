import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 280px;
  height: 32px;
`;

export const Option = styled.div<{ isSelected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 32px;
  border: ${({ isSelected }) => isSelected ? '1px solid #3545EE' : 'none'};
  border-radius: 4px;
  cursor: pointer;
`;

export const StateLayer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  width: 100%;
`;

export const TabContents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

export const Label = styled.span<{ isSelected: boolean }>`
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.5px;
  color: ${({ isSelected }) => isSelected ? '#3545EE' : '#49454F'};
  text-align: center;
`;