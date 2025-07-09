import styled from '@emotion/styled';

export const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  height: 40px;
`;

export const TabItem = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 40px;
  cursor: pointer;
  position: relative;
`;

export const StateLayer = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ active }) => (active ? '14px 12px' : '14px 16px')};
`;

export const TabContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TabLabel = styled.span<{ active: boolean }>`
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  text-align: center;
  color: ${({ active }) => (active ? '#3545EE' : '#49454F')};
`;

export const TabIndicator = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: #3545EE;
`;
