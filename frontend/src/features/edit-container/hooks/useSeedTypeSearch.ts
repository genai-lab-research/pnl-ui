// Seed Type Search Hook
// Handles seed type searching and filtering functionality

import { useState, useCallback, useMemo } from 'react';
import { SeedType } from '../../../types/containers';

export interface UseSeedTypeSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredSeedTypes: SeedType[];
  isSearching: boolean;
  selectedSeedTypes: SeedType[];
  availableSeedTypes: SeedType[];
  handleSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  isSelected: (seedTypeId: number) => boolean;
  getDisplayName: (seedType: SeedType) => string;
}

export function useSeedTypeSearch(
  seedTypes: SeedType[],
  selectedIds: number[],
  onSearch?: (query: string) => Promise<void>
): UseSeedTypeSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  

  // Filter seed types based on search query
  const filteredSeedTypes = useMemo(() => {
    if (!searchQuery.trim()) {
      return seedTypes;
    }

    const query = searchQuery.toLowerCase();
    return seedTypes.filter(seedType => 
      seedType.name.toLowerCase().includes(query) ||
      seedType.variety.toLowerCase().includes(query) ||
      seedType.supplier.toLowerCase().includes(query) ||
      seedType.batch_id.toLowerCase().includes(query)
    );
  }, [seedTypes, searchQuery]);

  // Get selected seed types
  const selectedSeedTypes = useMemo(() => {
    return selectedIds
      .map(id => seedTypes.find(st => st.id === id))
      .filter((st): st is SeedType => st !== undefined);
  }, [seedTypes, selectedIds]);

  // Handle search with debouncing
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (onSearch && query.trim()) {
      setIsSearching(true);
      try {
        await onSearch(query.trim());
      } finally {
        setIsSearching(false);
      }
    }
  }, [onSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  // Check if seed type is selected
  const isSelected = useCallback((seedTypeId: number): boolean => {
    return selectedIds.includes(seedTypeId);
  }, [selectedIds]);

  // Get display name for seed type
  const getDisplayName = useCallback((seedType: SeedType): string => {
    const parts = [seedType.name];
    if (seedType.variety) {
      parts.push(`(${seedType.variety})`);
    }
    if (seedType.supplier) {
      parts.push(`- ${seedType.supplier}`);
    }
    return parts.join(' ');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredSeedTypes,
    isSearching,
    selectedSeedTypes,
    availableSeedTypes: seedTypes,
    handleSearch,
    clearSearch,
    isSelected,
    getDisplayName
  };
}