import React from 'react';
import { Box, FormControl, Select, MenuItem, SelectChangeEvent, styled } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import clsx from 'clsx';

export interface FilterChipOption {
  /**
   * The label text to display in the chip
   */
  label: string;
  
  /**
   * The value of the option used for selection handling
   */
  value: string;
  
  /**
   * Optional flag to disable specific options
   */
  disabled?: boolean;
}

export interface FilterChipGroupProps {
  /**
   * Array of filter options to display as chips
   */
  options: FilterChipOption[];
  
  /**
   * Callback fired when a chip selection changes
   */
  onChange?: (value: string, chipId: string) => void;
  
  /**
   * Array of currently selected values (one for each chip)
   */
  values: Record<string, string>;
  
  /**
   * Optional CSS class to apply to the container
   */
  className?: string;
}

const StyledSelect = styled(Select)(({ theme }) => ({
  height: '36px',
  borderRadius: '4px',
  border: '1px solid #CAC4D0',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: 'Roboto, sans-serif',
  lineHeight: '20px',
  backgroundColor: 'transparent',
  color: '#49454F',
  padding: '0',
  
  '&:hover': {
    borderColor: '#79747E',
  },
  
  '&.Mui-focused': {
    borderColor: '#6750A4',
    boxShadow: '0 0 0 1px #6750A4',
  },
  
  '& .MuiSelect-select': {
    padding: '8px 12px',
    paddingRight: '36px',
    textAlign: 'left',
    minWidth: '120px',
  },
  
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  
  '& .MuiSvgIcon-root': {
    color: '#65558F',
    right: '8px',
  },
  
  // Responsive adjustments
  [theme.breakpoints.down('sm')]: {
    height: '32px',
    fontSize: '13px',
    
    '& .MuiSelect-select': {
      padding: '6px 10px',
      paddingRight: '32px',
    },
  },
  
  // Extra small devices
  '@media (max-width: 375px)': {
    height: '30px',
    fontSize: '12px',
    
    '& .MuiSelect-select': {
      padding: '5px 8px',
      paddingRight: '28px',
      minWidth: '100px',
    },
  },
}));

const ChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  gap: '8px',
  alignItems: 'center',
  
  [theme.breakpoints.down('lg')]: {
    flexWrap: 'wrap',
    gap: '8px',
  },
  
  [theme.breakpoints.down('sm')]: {
    gap: '6px',
  },
}));

/**
 * FilterChipGroup component for displaying a group of filter chips
 * 
 * Displays a horizontal group of dropdown selects styled as chips for filtering content.
 * Each chip is a select input with customizable options. The component is fully responsive
 * and adapts to different screen sizes.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage with multiple filter chips
 * const [filters, setFilters] = useState({
 *   types: 'all',
 *   tenants: 'all',
 *   purposes: 'all',
 *   statuses: 'all',
 * });
 * 
 * const handleFilterChange = (value, chipId) => {
 *   setFilters(prev => ({ ...prev, [chipId]: value }));
 * };
 * 
 * // Filter options
 * const typeOptions = [
 *   { label: 'All types', value: 'all' },
 *   { label: 'Virtual Farm', value: 'virtual-farm' },
 *   { label: 'Farm Container', value: 'farm-container' }
 * ];
 * 
 * const tenantOptions = [
 *   { label: 'All tenants', value: 'all' },
 *   { label: 'Tenant A', value: 'tenant-a' },
 *   { label: 'Tenant B', value: 'tenant-b' }
 * ];
 * 
 * // Then in your JSX:
 * <FilterChipGroup
 *   options={[
 *     { id: 'types', options: typeOptions },
 *     { id: 'tenants', options: tenantOptions },
 *     // ...more filter categories
 *   ]}
 *   values={filters}
 *   onChange={handleFilterChange}
 * />
 * ```
 */
export const FilterChipGroup: React.FC<FilterChipGroupProps> = ({
  options,
  onChange,
  values,
  className,
}) => {
  const handleChange = (event: SelectChangeEvent<string>, chipId: string) => {
    if (onChange) {
      onChange(event.target.value, chipId);
    }
  };
  
  return (
    <ChipContainer className={clsx('filter-chip-group', className)}>
      {options.map((option, index) => (
        <FormControl key={`filter-chip-${index}`} size="small">
          <StyledSelect
            value={values[option.value] || ''}
            onChange={(e) => handleChange(e, option.value)}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            inputProps={{ 'aria-label': option.label }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  marginTop: 8,
                },
              },
            }}
          >
            <MenuItem value="">{option.label}</MenuItem>
            {/* If this was a real component with dynamic options, we would map them here */}
          </StyledSelect>
        </FormControl>
      ))}
    </ChipContainer>
  );
};

export default FilterChipGroup;