// Container Search Hook
// Provides search functionality with debouncing and state management

import { useState, useCallback, useEffect } from 'react';
import { useSearchDebounce, useAsyncDebounce } from './useDebounce';
import { FiltersDomainModel } from '../models';

export interface UseContainerSearchOptions {
  debounceDelay?: number;
  minSearchLength?: number;
  onSearchChange?: (query: string) => Promise<void>;
  initialSearchTerm?: string;
}

export interface UseContainerSearchReturn {
  // Search state
  searchTerm: string;
  debouncedSearchTerm: string;
  isSearching: boolean;
  hasSearchChanged: boolean;
  searchError: string | null;
  
  // Search actions
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  executeSearch: (term?: string) => Promise<void>;
  
  // Search validation
  isSearchValid: boolean;
  searchPlaceholder: string;
  
  // Recent searches (optional feature)
  recentSearches: string[];
  addToRecentSearches: (term: string) => void;
  clearRecentSearches: () => void;
}

const RECENT_SEARCHES_KEY = 'container-dashboard-recent-searches';
const MAX_RECENT_SEARCHES = 5;

export function useContainerSearch({
  debounceDelay = 300,
  minSearchLength = 2,
  onSearchChange,
  initialSearchTerm = ''
}: UseContainerSearchOptions = {}): UseContainerSearchReturn {
  
  const {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    isSearching,
    hasSearchChanged,
    clearSearch
  } = useSearchDebounce(initialSearchTerm, debounceDelay);
  
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  const {
    debouncedAsyncCall: executeSearchAsync,
    isLoading: isSearchLoading,
    error: searchError
  } = useAsyncDebounce(async (query: string) => {
    if (onSearchChange && isSearchValid) {
      await onSearchChange(query);
      
      // Add to recent searches if it's a valid search
      if (query.trim().length >= minSearchLength) {
        addToRecentSearches(query.trim());
      }
    }
  }, debounceDelay);
  
  // Validate search term
  const isSearchValid = searchTerm.length === 0 || searchTerm.length >= minSearchLength;
  
  // Execute search when debounced term changes
  useEffect(() => {
    if (hasSearchChanged) {
      executeSearchAsync(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, hasSearchChanged, executeSearchAsync]);
  
  // Manual search execution
  const executeSearch = useCallback(async (term?: string) => {
    const searchQuery = term ?? searchTerm;
    if (searchQuery.length >= minSearchLength || searchQuery.length === 0) {
      await executeSearchAsync(searchQuery);
    }
  }, [searchTerm, minSearchLength, executeSearchAsync]);
  
  // Recent searches management
  const addToRecentSearches = useCallback((term: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(search => search !== term);
      const updated = [term, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      
      return updated;
    });
  }, []);
  
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore localStorage errors
    }
  }, []);
  
  // Generate appropriate placeholder text
  const searchPlaceholder = `Search containers${minSearchLength > 1 ? ` (min ${minSearchLength} chars)` : ''}...`;
  
  return {
    // Search state
    searchTerm,
    debouncedSearchTerm,
    isSearching: isSearching || isSearchLoading,
    hasSearchChanged,
    searchError,
    
    // Search actions
    setSearchTerm,
    clearSearch,
    executeSearch,
    
    // Search validation
    isSearchValid,
    searchPlaceholder,
    
    // Recent searches
    recentSearches,
    addToRecentSearches,
    clearRecentSearches
  };
}

// Specialized hook for container search with filters integration
export function useContainerSearchWithFilters(
  filters: FiltersDomainModel,
  onFiltersChange: (filters: FiltersDomainModel) => Promise<void>
) {
  const searchHook = useContainerSearch({
    onSearchChange: async (query: string) => {
      const updatedFilters = filters.withSearch(query);
      await onFiltersChange(updatedFilters);
    },
    initialSearchTerm: filters.state.search
  });
  
  // Additional methods specific to filter integration
  const applySearchToFilters = useCallback(async (searchTerm: string) => {
    const updatedFilters = filters.withSearch(searchTerm);
    await onFiltersChange(updatedFilters);
  }, [filters, onFiltersChange]);
  
  const clearSearchFromFilters = useCallback(async () => {
    const updatedFilters = filters.withSearch('');
    await onFiltersChange(updatedFilters);
    searchHook.clearSearch();
  }, [filters, onFiltersChange, searchHook]);
  
  return {
    ...searchHook,
    applySearchToFilters,
    clearSearchFromFilters,
    currentSearchInFilters: filters.state.search
  };
}

// Hook for search suggestions (could be extended with backend integration)
export function useSearchSuggestions(searchTerm: string, enabled: boolean = true) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions] = useState(false);
  
  useEffect(() => {
    if (!enabled || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    
    // This could be replaced with actual backend API call
    const mockSuggestions = [
      'Container Alpha',
      'Container Beta',
      'Production Container',
      'Development Container',
      'Research Container'
    ].filter(suggestion => 
      suggestion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSuggestions(mockSuggestions);
  }, [searchTerm, enabled]);
  
  return {
    suggestions,
    isLoadingSuggestions,
    hasSuggestions: suggestions.length > 0
  };
}
