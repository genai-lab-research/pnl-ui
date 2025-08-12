// Custom hook for infinite scroll functionality
// Provides scroll detection and load more capabilities

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number; // Distance from bottom in pixels
  rootMargin?: string; // Intersection observer root margin
  onLoadMore: () => Promise<void> | void;
  disabled?: boolean;
}

export interface UseInfiniteScrollResult {
  // Refs for DOM elements
  scrollRef: React.RefObject<HTMLElement>;
  sentinelRef: React.RefObject<HTMLElement>;
  
  // State
  isLoadingMore: boolean;
  
  // Actions
  loadMore: () => Promise<void>;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions): UseInfiniteScrollResult {
  const {
    hasMore,
    isLoading,
    threshold = 100,
    rootMargin = '0px',
    onLoadMore,
    disabled = false
  } = options;

  const scrollRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load more function with loading state management
  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore || disabled) {
      return;
    }

    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasMore, disabled, onLoadMore]);

  // Intersection Observer for sentinel element
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || disabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          loadMore();
        }
      },
      {
        root: scrollRef.current,
        rootMargin,
        threshold: 0.1
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
      observer.disconnect();
    };
  }, [hasMore, isLoading, isLoadingMore, disabled, loadMore, rootMargin]);

  // Scroll utilities
  const scrollToTop = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const { scrollHeight } = scrollRef.current;
      scrollRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    }
  }, []);

  return {
    scrollRef,
    sentinelRef,
    isLoadingMore,
    loadMore,
    scrollToTop,
    scrollToBottom
  };
}

// Hook for virtual scrolling with infinite scroll
export function useVirtualInfiniteScroll<T>(options: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
}) {
  const {
    items,
    itemHeight,
    containerHeight,
    overscan = 5,
    hasMore,
    isLoading,
    onLoadMore
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleCount + overscan * 2
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    const target = event.currentTarget;
    setScrollTop(target.scrollTop);

    // Check if we need to load more
    const scrolledToBottom = 
      target.scrollTop + target.clientHeight >= target.scrollHeight - 100;

    if (scrolledToBottom && hasMore && !isLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      onLoadMore().finally(() => setIsLoadingMore(false));
    }
  }, [hasMore, isLoading, isLoadingMore, onLoadMore]);

  return {
    visibleItems,
    startIndex,
    totalHeight,
    offsetY: startIndex * itemHeight,
    isLoadingMore,
    handleScroll
  };
}

// Hook for scroll position persistence
export function useScrollPosition(key: string) {
  const scrollRef = useRef<HTMLElement>(null);

  // Save scroll position
  const saveScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      sessionStorage.setItem(`scroll-${key}`, scrollTop.toString());
    }
  }, [key]);

  // Restore scroll position
  const restoreScrollPosition = useCallback(() => {
    const savedPosition = sessionStorage.getItem(`scroll-${key}`);
    if (savedPosition && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedPosition, 10);
    }
  }, [key]);

  // Clear saved position
  const clearScrollPosition = useCallback(() => {
    sessionStorage.removeItem(`scroll-${key}`);
  }, [key]);

  // Auto-save on scroll
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    let timeoutId: number;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(saveScrollPosition, 150);
    };

    element.addEventListener('scroll', handleScroll);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [saveScrollPosition]);

  return {
    scrollRef,
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition
  };
}

// Hook for smooth scrolling to specific elements
export function useSmoothScroll() {
  const scrollToElement = useCallback((
    elementId: string,
    options?: {
      behavior?: ScrollBehavior;
      block?: ScrollLogicalPosition;
      inline?: ScrollLogicalPosition;
      offset?: number;
    }
  ) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const { behavior = 'smooth', block = 'start', inline = 'nearest', offset = 0 } = options || {};

    if (offset !== 0) {
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementTop - offset,
        behavior
      });
    } else {
      element.scrollIntoView({ behavior, block, inline });
    }
  }, []);

  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({ top: 0, behavior });
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({ top: document.body.scrollHeight, behavior });
  }, []);

  return {
    scrollToElement,
    scrollToTop,
    scrollToBottom
  };
}
