import React, { useState } from 'react';
import { ArrowDropDown } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { SelectContainer, SelectInput, InactiveContainer, Label, ArrowContainer } from './PurposeSelect.styles';
import { PurposeSelectProps } from './types';

const PurposeSelect: React.FC<PurposeSelectProps> = ({ 
  value,
  onChange,
  placeholder = 'Purpose',
  disabled = false,
  width
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const options = [
    { label: 'Development', value: 'development' },
    { label: 'Research', value: 'research' },
    { label: 'Production', value: 'production' }
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue);
    }
    handleClose();
  };

  const getDisplayValue = () => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : placeholder;
  };

  return (
    <>
      <SelectContainer width={width}>
        <SelectInput>
          <InactiveContainer onClick={handleClick}>
            <Label>{getDisplayValue()}</Label>
            <ArrowContainer>
              <ArrowDropDown />
            </ArrowContainer>
          </InactiveContainer>
        </SelectInput>
      </SelectContainer>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: anchorEl ? anchorEl.offsetWidth : 'auto',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            onClick={() => handleSelect(option.value)}
            selected={value === option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default PurposeSelect;
