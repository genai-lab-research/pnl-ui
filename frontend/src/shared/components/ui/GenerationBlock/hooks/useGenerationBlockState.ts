import { useState, useCallback } from 'react';
import { FilterChip } from '../types';

export interface UseGenerationBlockStateProps {
  initialSearchValue?: string;
  initialFilterChips?: FilterChip[];
  initialHasAlerts?: boolean;
}

export interface UseGenerationBlockStateReturn {
  searchValue: string;
  filterChips: FilterChip[];
  hasAlerts: boolean;
  handleSearchChange: (value: string) => void;
  handleChipClick: (chipId: string) => void;
  handleAlertsToggle: (enabled: boolean) => void;
  handleClearFilters: () => void;
}

export const useGenerationBlockState = ({
  initialSearchValue = '',
  initialFilterChips = [
    { id: 'types', label: 'All types' },
    { id: 'tenants', label: 'All tenants' },
    { id: 'purposes', label: 'All purposes' },
    { id: 'statuses', label: 'All statuses' }
  ],
  initialHasAlerts = false
}: UseGenerationBlockStateProps = {}): UseGenerationBlockStateReturn => {
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [filterChips, setFilterChips] = useState(initialFilterChips);
  const [hasAlerts, setHasAlerts] = useState(initialHasAlerts);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleChipClick = useCallback((chipId: string) => {
    setFilterChips(prev => 
      prev.map(chip => 
        chip.id === chipId 
          ? { ...chip, isActive: !chip.isActive }
          : chip
      )
    );
  }, []);

  const handleAlertsToggle = useCallback((enabled: boolean) => {
    setHasAlerts(enabled);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchValue('');
    setFilterChips(prev => 
      prev.map(chip => ({ ...chip, isActive: false }))
    );
    setHasAlerts(false);
  }, []);

  return {
    searchValue,
    filterChips,
    hasAlerts,
    handleSearchChange,
    handleChipClick,
    handleAlertsToggle,
    handleClearFilters
  };
};