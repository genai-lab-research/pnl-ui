import React from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  InputLabel,
} from '@mui/material';

interface Option {
  label: string;
  value: string;
}

interface SelectFilterProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

const SelectFilter: React.FC<SelectFilterProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth size="small">
      {label && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
      <Select
        labelId={`${id}-label`}
        id={id}
        value={value}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': `${id}-select` }}
        sx={{
          height: '40px',
          border: '1px solid #E0E0E0',
          borderRadius: '4px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2196f3',
          },
          '& .MuiSelect-select': {
            paddingTop: '8px',
            paddingBottom: '8px',
            fontWeight: 500,
            color: '#424242',
          },
        }}
      >
        <MenuItem value="all">
          {placeholder || 'All'}
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;
