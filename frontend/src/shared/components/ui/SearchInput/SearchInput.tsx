import React from 'react';
import { InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import clsx from 'clsx';

export interface SearchInputProps {
  /**
   * Placeholder text to display when the input is empty
   */
  placeholder?: string;
  
  /**
   * The value of the search input
   */
  value?: string;
  
  /**
   * Callback fired when the search input value changes
   */
  onChange?: (value: string) => void;
  
  /**
   * Additional CSS class name for styling
   */
  className?: string;
  
  /**
   * Whether the search input is disabled
   */
  disabled?: boolean;
}

const StyledInputContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #CAC4D0',
  borderRadius: '4px',
  padding: '0 12px',
  backgroundColor: 'transparent',
  height: '36px',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
  },
  '&.Mui-disabled': {
    opacity: 0.7,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    cursor: 'not-allowed',
  },
}));

const StyledInputBase = styled(InputBase)(() => ({
  flex: 1,
  color: '#49454F',
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 500,
  fontFamily: 'Roboto, sans-serif',
  '& .MuiInputBase-input': {
    padding: '8px 0',
  },
  '&.Mui-disabled': {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#49454F',
    opacity: 1,
  },
}));

const StyledSearchIcon = styled(SearchIcon)(() => ({
  color: '#65558F',
  marginRight: '8px',
  width: '20px',
  height: '20px',
}));

/**
 * SearchInput component provides a search input field with a search icon.
 * Built on Material UI's InputBase component, it matches the design from Figma.
 * 
 * @component
 * @example
 * ```tsx
 * const [searchValue, setSearchValue] = useState('');
 * 
 * return (
 *   <SearchInput 
 *     placeholder="All types" 
 *     value={searchValue} 
 *     onChange={(value) => setSearchValue(value)} 
 *   />
 * );
 * ```
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'All types',
  value = '',
  onChange,
  className,
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <StyledInputContainer 
      className={clsx(className, { 'Mui-disabled': disabled })}
    >
      <StyledSearchIcon />
      <StyledInputBase
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        fullWidth
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </StyledInputContainer>
  );
};

export default SearchInput;
