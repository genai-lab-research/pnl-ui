// Seed Type Search Hook
// Debounced search for seed types with autocomplete functionality

import { useState, useEffect, useCallback, useRef } from 'react';
import { createContainerApiAdapter } from '../services/create-container-api.adapter';
import { SeedType } from '../../../types/containers';

export interface UseSeedTypeSearchReturn {
  searchQuery: string;
  isSearching: boolean;
  searchResults: SeedType[];
  searchError: string | null;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  selectSeedType: (seedType: SeedType) => void;
}

export function useSeedTypeSearch(
  debounceMs: number = 300,
  onSeedTypeSelect?: (seedType: SeedType) => void
): UseSeedTypeSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SeedType[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const debounceRef = useRef<number>();
  const currentQueryRef = useRef<string>('');

  const performSearch = useCallback(async (query: string) => {
    currentQueryRef.current = query;
    setIsSearching(true);
    setSearchError(null);

    try {
      const result = await createContainerApiAdapter.searchSeedTypes(query);
      
      // Check if query hasn't changed while we were searching
      if (currentQueryRef.current === query) {
        if (result.error) {
          setSearchError(result.error);
          setSearchResults([]);
        } else {
          setSearchResults(result.seedTypes);
        }
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Seed type search error:', error);
      if (currentQueryRef.current === query) {
        setSearchError('Search failed');
        setSearchResults([]);
        setIsSearching(false);
      }
    }
  }, []);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // If query is empty, clear results immediately
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      currentQueryRef.current = '';
      return;
    }

    // Debounce the search
    debounceRef.current = window.setTimeout(() => {
      performSearch(query);
    }, debounceMs);
  }, [debounceMs, performSearch]);

  const clearSearch = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setSearchError(null);
    currentQueryRef.current = '';
  }, []);

  const selectSeedType = useCallback((seedType: SeedType) => {
    onSeedTypeSelect?.(seedType);
    clearSearch();
  }, [onSeedTypeSelect, clearSearch]);

  // Load initial seed types on mount
  useEffect(() => {
    performSearch('');
  }, [performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    searchQuery,
    isSearching,
    searchResults,
    searchError,
    setSearchQuery: handleSearchQueryChange,
    clearSearch,
    selectSeedType
  };
}