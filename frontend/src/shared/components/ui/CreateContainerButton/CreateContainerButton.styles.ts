import styled from '@emotion/styled';

export const Button = styled.button<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: 40px;
  padding: 10px 12px;
  border-radius: 6px;
  border: none;
  background-color: #3545EE;
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0px;
  text-align: center;
  color: #FAFAFA;

  &:focus {
    outline: none;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

export const Container = styled.div`
  width: fit-content;
  height: 40px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;