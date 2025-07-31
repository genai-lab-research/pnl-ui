import React from 'react';
import { GenerationBlockProps } from './types';
import {
  GenerationBlockContainer,
  FilterActionsContainer,
  ChipGroupsContainer
} from './styles';
import {
  SearchInput,
  FilterChip,
  AlertsToggle,
  ClearFiltersButton
} from './components';

export const GenerationBlock: React.FC<GenerationBlockProps> = ({
  searchValue = '',
  onSearchChange,
  filterChips = [
    { id: 'types', label: 'All types' },
    { id: 'tenants', label: 'All tenants' },
    { id: 'purposes', label: 'All purposes' },
    { id: 'statuses', label: 'All statuses' }
  ],
  onChipClick,
  onChipOptionSelect,
  hasAlerts = false,
  onAlertsToggle,
  onClearFilters,
  className,
  isSearchLoading = false,
  isFilterLoading = false
}) => {
  return (
    <GenerationBlockContainer className={className}>
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search containers..."
        isLoading={isSearchLoading}
      />
      
      <FilterActionsContainer>
        <ChipGroupsContainer>
          {filterChips.map((chip) => (
            <FilterChip
              key={chip.id}
              chip={chip}
              onClick={onChipClick}
              onOptionSelect={onChipOptionSelect}
              isLoading={isFilterLoading}
            />
          ))}
        </ChipGroupsContainer>
        
        <AlertsToggle
          checked={hasAlerts}
          onChange={onAlertsToggle}
          isLoading={isFilterLoading}
        />
        
        <ClearFiltersButton onClick={onClearFilters} />
      </FilterActionsContainer>
    </GenerationBlockContainer>
  );
};