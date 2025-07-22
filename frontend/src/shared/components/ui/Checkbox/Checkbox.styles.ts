import styled from '@emotion/styled';

export const CheckboxContainer = styled.div`
  display: flex;
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

export const StyledCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: relative;
  margin: 0;
  
  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    border: 1px solid #4C4E64;
    border-radius: 2px;
    opacity: 0.6;
    box-sizing: border-box;
  }

  &:checked::after {
    content: '';
    display: block;
    position: absolute;
    width: 10px;
    height: 10px;
    top: 5px;
    left: 5px;
    background-color: #4C4E64;
    opacity: 0.6;
    border-radius: 1px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
