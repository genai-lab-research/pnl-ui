import styled from '@emotion/styled';

export const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SelectInput = styled.select<{ error?: boolean }>`
  width: 100%;
  padding: 12px 40px 12px 12px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  background: #fff;
  border: 1px solid ${props => props.error ? '#f44336' : '#e0e0e0'};
  border-radius: 8px;
  outline: none;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    border-color: ${props => props.error ? '#f44336' : '#1976d2'};
    box-shadow: 0 0 0 2px ${props => props.error ? '#f4433626' : '#1976d226'};
  }
  
  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: #999;
  }
`;

export const MultiSelectContainer = styled.div<{ error?: boolean }>`
  width: 100%;
  min-height: 40px;
  padding: 8px 40px 8px 8px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  background: #fff;
  border: 1px solid ${props => props.error ? '#f44336' : '#e0e0e0'};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  
  &:focus-within {
    border-color: ${props => props.error ? '#f44336' : '#1976d2'};
    box-shadow: 0 0 0 2px ${props => props.error ? '#f4433626' : '#1976d226'};
  }
`;

export const SelectedTag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
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
  color: #1976d2;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  
  &:hover {
    color: #1565c0;
  }
`;

export const DropdownIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Placeholder = styled.span`
  color: #999;
  flex: 1;
`;

export const HelperText = styled.div<{ error?: boolean }>`
  margin-top: 4px;
  font-size: 12px;
  color: ${props => props.error ? '#f44336' : '#666'};
`;

export const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
`;

export const DropdownOption = styled.div<{ selected?: boolean; disabled?: boolean }>`
  padding: 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background: ${props => 
    props.disabled ? '#f5f5f5' : 
    props.selected ? '#e3f2fd' : 'transparent'
  };
  color: ${props => props.disabled ? '#999' : '#333'};
  
  &:hover {
    background: ${props => 
      props.disabled ? '#f5f5f5' : 
      props.selected ? '#e3f2fd' : '#f5f5f5'
    };
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;