import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 296px;
  height: 32px;
  border: 1px solid #9747FF;
  border-radius: 5px;
  background-color: #000000;
  cursor: pointer;
  gap: 8px;
`;

export const Text = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 28px;
  color: #000000;
  flex-grow: 1;
  padding-left: 8px;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding-right: 8px;
`;
