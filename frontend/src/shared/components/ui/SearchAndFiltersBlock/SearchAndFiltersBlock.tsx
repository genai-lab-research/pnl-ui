import React, { useState, useEffect } from 'react';
import { Box, Button, styled } from '@mui/material';
import SearchInput from '../SearchInput/SearchInput';
import { FilterChipOption } from '../FilterChipGroup/FilterChipGroup';
import HasAlertsToggle from '../HasAlertsToggle/HasAlertsToggle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Select, MenuItem, FormControl } from '@mui/material';
import tenantService from '../../../../services/tenantService';
import { Tenant } from '../../../types/tenants';
import clsx from 'clsx';

export interface SearchAndFiltersBlockProps {
  /**
   * Current search value
   */
  searchValue?: string;

  /**
   * Callback fired when search input changes
   */
  onSearchChange?: (value: string) => void;

  /**
   * Type filter options
   */
  typeOptions?: FilterChipOption[];

  /**
   * Tenant filter options
   */
  tenantOptions?: FilterChipOption[];

  /**
   * Purpose filter options
   */
  purposeOptions?: FilterChipOption[];

  /**
   * Status filter options
   */
  statusOptions?: FilterChipOption[];

  /**
   * Current filter values
   */
  filterValues?: Record<string, string>;

  /**
   * Callback fired when filter values change
   */
  onFilterChange?: (value: string, filterId: string) => void;

  /**
   * Whether to show only items with alerts
   */
  hasAlerts?: boolean;

  /**
   * Callback fired when has alerts toggle changes
   */
  onHasAlertsChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;

  /**
   * Callback fired when clear filters button is clicked
   */
  onClearFilters?: () => void;

  /**
   * Additional CSS class name
   */
  className?: string;
}

const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '0px',
  padding: '12px 16px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
  boxShadow: '0px 0px 2px rgba(65, 64, 69, 1)',
  flexWrap: 'nowrap',
  
  // Large screens (≥1200px) - all in one row
  [theme.breakpoints.down('xl')]: {
    flexWrap: 'wrap',
    gap: '6px',
  },
  
  // Medium screens (768px-1199px) - allow wrapping
  [theme.breakpoints.down('lg')]: {
    flexWrap: 'wrap',
    gap: '8px',
    padding: '12px 12px',
  },
  
  // Small tablets (600px-767px) - tighter layout
  [theme.breakpoints.down('md')]: {
    flexWrap: 'wrap',
    gap: '6px',
    padding: '10px 12px',
  },
  
  // Mobile (≤600px) - column layout
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '12px',
    padding: '12px',
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  width: '300px',
  minWidth: '300px',
  flexShrink: 0,
  
  // Large screens (≥1200px) - full width
  [theme.breakpoints.down('xl')]: {
    width: '280px',
    minWidth: '280px',
  },
  
  // Medium-large (768px-1199px) - reduce width
  [theme.breakpoints.down('lg')]: {
    width: '260px',
    minWidth: '260px',
  },
  
  // Medium (600px-767px) - smaller width
  [theme.breakpoints.down('md')]: {
    width: '240px',
    minWidth: '240px',
  },
  
  // Small tablets (480px-599px) - flex to content
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    minWidth: 'auto',
    flexBasis: '100%',
  },
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'end',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'nowrap',
  gap: '16px',
  flexGrow: 1,
  
  // Extra large screens (≥1536px) - all in one row
  [theme.breakpoints.down('xl')]: {
    flexWrap: 'wrap',
    gap: '12px',
  },
  
  // Large screens (≥1200px) - allow wrapping with smaller gaps
  [theme.breakpoints.down('lg')]: {
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  
  // Medium screens (600px-1199px) - tighter wrapping
  [theme.breakpoints.down('md')]: {
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'flex-start',
  },
  
  // Small screens (≤600px) - column layout
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '12px',
    justifyContent: 'stretch',
  },
}));

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
  padding: '4px 8px',
  minWidth: '118px',
  flexShrink: 0,
  
  '&:hover': {
    borderColor: '#79747E',
  },
  
  '&.Mui-focused': {
    borderColor: '#6750A4',
    boxShadow: '0 0 0 1px #6750A4',
  },
  
  '& .MuiSelect-select': {
    padding: '4px 8px',
    paddingRight: '36px',
    textAlign: 'left',
  },
  
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  
  '& .MuiSvgIcon-root': {
    color: '#65558F',
    right: '8px',
  },
  
  // Large screens (≥1200px) - standard size
  [theme.breakpoints.down('lg')]: {
    minWidth: '110px',
    fontSize: '13px',
  },
  
  // Medium screens (600px-1199px) - slightly smaller
  [theme.breakpoints.down('md')]: {
    height: '34px',
    minWidth: '105px',
    fontSize: '13px',
    
    '& .MuiSelect-select': {
      padding: '3px 6px',
      paddingRight: '34px',
    },
  },
  
  // Small screens (≤600px) - compact size
  [theme.breakpoints.down('sm')]: {
    height: '32px',
    fontSize: '13px',
    minWidth: '100%',
    flexShrink: 1,
    
    '& .MuiSelect-select': {
      padding: '6px 10px',
      paddingRight: '32px',
    },
  },
}));

const ToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '4px',
  flexShrink: 0,
  
  [theme.breakpoints.down('md')]: {
    marginLeft: '2px',
  },
  
  [theme.breakpoints.down('sm')]: {
    marginLeft: '0px',
    width: '100%',
    justifyContent: 'flex-start',
  },
}));

const ClearFiltersButton = styled(Button)(({ theme }) => ({
  height: '36px',
  padding: '0 16px',
  backgroundColor: 'rgba(109, 120, 141, 0.11)',
  color: '#000000',
  textTransform: 'none',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  border: 'none',
  borderRadius: '4px',
  marginLeft: '4px',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: 'rgba(109, 120, 141, 0.16)',
  },
  
  // Large screens (≥1200px) - standard size
  [theme.breakpoints.down('lg')]: {
    fontSize: '13px',
    padding: '0 14px',
  },
  
  // Medium screens (600px-1199px) - slightly smaller
  [theme.breakpoints.down('md')]: {
    height: '34px',
    fontSize: '13px',
    padding: '0 12px',
    marginLeft: '2px',
  },
  
  // Small screens (≤600px) - full width on mobile
  [theme.breakpoints.down('sm')]: {
    height: '32px',
    fontSize: '13px',
    padding: '0 12px',
    marginLeft: '0px',
    width: '100%',
  },
}));

/**
 * SearchAndFiltersBlock component provides a unified interface for searching and filtering container data.
 * It combines SearchInput, FilterChipGroup, HasAlertsToggle, and a Clear Filters button in a single block.
 * 
 * This component manages the layout and responsiveness of these elements, ensuring they work together
 * as a cohesive unit while maintaining proper spacing and alignment at all screen sizes.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage with all filter types
 * const [search, setSearch] = useState('');
 * const [filters, setFilters] = useState({
 *   types: '',
 *   tenants: '',
 *   purposes: '',
 *   statuses: '',
 * });
 * const [hasAlerts, setHasAlerts] = useState(false);
 * 
 * const handleSearchChange = (value) => setSearch(value);
 * 
 * const handleFilterChange = (value, filterId) => {
 *   setFilters(prev => ({ ...prev, [filterId]: value }));
 * };
 * 
 * const handleHasAlertsChange = (e, checked) => setHasAlerts(checked);
 * 
 * const handleClearFilters = () => {
 *   setSearch('');
 *   setFilters({
 *     types: '',
 *     tenants: '',
 *     purposes: '',
 *     statuses: '',
 *   });
 *   setHasAlerts(false);
 * };
 * 
 * <SearchAndFiltersBlock
 *   searchValue={search}
 *   onSearchChange={handleSearchChange}
 *   typeOptions={[{ label: 'All types', value: 'types' }]}
 *   tenantOptions={[{ label: 'All tenants', value: 'tenants' }]}
 *   purposeOptions={[{ label: 'All purposes', value: 'purposes' }]}
 *   statusOptions={[{ label: 'All statuses', value: 'statuses' }]}
 *   filterValues={filters}
 *   onFilterChange={handleFilterChange}
 *   hasAlerts={hasAlerts}
 *   onHasAlertsChange={handleHasAlertsChange}
 *   onClearFilters={handleClearFilters}
 * />
 * ```
 */
export const SearchAndFiltersBlock: React.FC<SearchAndFiltersBlockProps> = ({
  searchValue = '',
  onSearchChange,
  filterValues = {},
  onFilterChange,
  hasAlerts = false,
  onHasAlertsChange,
  onClearFilters,
  className,
}) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);

  // Load tenants on component mount
  useEffect(() => {
    const loadTenants = async () => {
      try {
        const tenantsData = await tenantService.getTenants();
        setTenants(tenantsData);
      } catch (error) {
        console.error('Failed to load tenants:', error);
      }
    };

    loadTenants();
  }, []);

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, filterId: string) => {
    if (onFilterChange) {
      onFilterChange(e.target.value, filterId);
    }
  };

  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };

  // Predefined filter options
  const containerTypes = [
    { label: 'All types', value: 'All types' },
    { label: 'Physical', value: 'PHYSICAL' },
    { label: 'Virtual', value: 'VIRTUAL' }
  ];

  const purposes = [
    { label: 'All purposes', value: 'All purposes' },
    { label: 'Development', value: 'Development' },
    { label: 'Research', value: 'Research' },
    { label: 'Production', value: 'Production' }
  ];

  const statuses = [
    { label: 'All statuses', value: 'All statuses' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Created', value: 'CREATED' },
    { label: 'Maintenance', value: 'MAINTENANCE' },
    { label: 'Inactive', value: 'INACTIVE' }
  ];

  const tenantFilterOptions = [
    { label: 'All tenants', value: 'All tenants' },
    ...tenants.map(tenant => ({ 
      label: tenant.name, 
      value: tenant.id 
    }))
  ];

  const renderSelect = (
    options: { label: string; value: string }[],
    filterId: string,
    defaultLabel: string
  ) => {
    return (
      <FormControl size="small" key={filterId}>
        <StyledSelect
          value={filterValues[filterId] || defaultLabel}
          onChange={(e) => handleFilterChange(e as unknown as React.ChangeEvent<HTMLInputElement>, filterId)}
          displayEmpty
          IconComponent={KeyboardArrowDownIcon}
          inputProps={{ 'aria-label': defaultLabel }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
                marginTop: 8,
              },
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    );
  };

  return (
    <StyledContainer className={clsx('search-and-filters-block', className)}>
      <SearchContainer>
        <SearchInput
          placeholder="Search containers..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </SearchContainer>

      <FiltersContainer>
        {renderSelect(containerTypes, 'type', 'All types')}
        {renderSelect(tenantFilterOptions, 'tenant', 'All tenants')}
        {renderSelect(purposes, 'purpose', 'All purposes')}
        {renderSelect(statuses, 'status', 'All statuses')}
        
        <ToggleContainer>
          <HasAlertsToggle
            checked={hasAlerts}
            onChange={onHasAlertsChange}
            label="Has Alerts"
          />
        </ToggleContainer>
        
        <ClearFiltersButton
          onClick={handleClearFilters}
          variant="text"
        >
          Clear Filters
        </ClearFiltersButton>
      </FiltersContainer>
    </StyledContainer>
  );
};

export default SearchAndFiltersBlock;