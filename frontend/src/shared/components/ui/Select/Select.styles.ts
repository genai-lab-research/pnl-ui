import styled from '@emotion/styled';
import { background, text, border, status, interactive, shadow } from '../../../styles/colors';

export const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SelectInput = styled.select<{ error?: boolean }>`
  width: 100%;
  height: 40px;
  padding: 12px 40px 12px 12px;
  font-size: 14px;
  font-family: inherit;
  color: ${text.primary};
  background: ${background.primary};
  border: 1px solid ${props => props.error ? border.inputError : border.input};
  border-radius: 8px;
  outline: none;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: ${props => props.error ? border.inputError : border.inputFocus};
    box-shadow: 0 0 0 2px ${props => props.error ? status.error + '26' : status.info + '26'};
  }

  &:disabled {
    background: ${interactive.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: ${text.disabled};
  }
`;

export const MultiSelectContainer = styled.div<{ error?: boolean }>`
  width: 100%;
  min-height: 40px;
  padding: 8px 40px 8px 8px;
  font-size: 14px;
  font-family: inherit;
  color: ${text.primary};
  background: ${background.primary};
  border: 1px solid ${props => props.error ? border.inputError : border.input};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;

  &:focus-within {
    border-color: ${props => props.error ? border.inputError : border.inputFocus};
    box-shadow: 0 0 0 2px ${props => props.error ? status.error + '26' : status.info + '26'};
  }
`;

export const SelectedTag = styled.span`
  background: ${interactive.selected};
  color: ${status.info};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${status.info};
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;

  &:hover {
    color: ${status.info};
    opacity: 0.8;
  }
`;

export const DropdownIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${text.muted};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Placeholder = styled.span`
  color: ${text.disabled};
  flex: 1;
`;

export const HelperText = styled.div<{ error?: boolean }>`
  margin-top: 4px;
  font-size: 12px;
  color: ${props => props.error ? border.inputError : text.muted};
`;

export const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${background.primary};
  border: 1px solid ${border.input};
  border-radius: 8px;
  box-shadow: 0 4px 12px ${shadow.light};
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
`;

export const DropdownOption = styled.div<{ selected?: boolean; disabled?: boolean }>`
  padding: 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background: ${props =>
    props.disabled ? interactive.disabled :
    props.selected ? interactive.selected : 'transparent'
  };
  color: ${props => props.disabled ? text.disabled : text.primary};

  &:hover {
    background: ${props =>
      props.disabled ? interactive.disabled :
      props.selected ? interactive.selected : interactive.hover
    };
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;