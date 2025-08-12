// Custom hook for polling/real-time data updates
// Provides configurable polling with pause/resume capabilities

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UsePollingOptions<T> {
  fetchData: () => Promise<T>;
  interval: number; // in milliseconds
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retryOnError?: boolean;
  retryDelay?: number; // in milliseconds
  maxRetries?: number;
}

export interface UsePollingResult<T> {
  data: T | null;
  isPolling: boolean;
  error: Error | null;
  retryCount: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  refresh: () => Promise<void>;
  setInterval: (newInterval: number) => void;
}

export function usePolling<T>(options: UsePollingOptions<T>): UsePollingResult<T> {
  const {
    fetchData,
    interval,
    enabled = true,
    onSuccess,
    onError,
    retryOnError = true,
    retryDelay = 5000,
    maxRetries = 3
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isPolling, setIsPolling] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentInterval, setCurrentInterval] = useState(interval);

  const intervalRef = useRef<number | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  // Fetch data function with error handling
  const fetchDataWithRetry = useCallback(async () => {
    try {
      const result = await fetchData();
      setData(result);
      setError(null);
      setRetryCount(0);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      if (onError) {
        onError(error);
      }

      // Retry logic
      if (retryOnError && retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        retryTimeoutRef.current = setTimeout(() => {
          fetchDataWithRetry();
        }, retryDelay);
      }
    }
  }, [fetchData, onSuccess, onError, retryOnError, retryCount, maxRetries, retryDelay]);

  // Start polling
  const start = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsPolling(true);
    
    // Initial fetch
    fetchDataWithRetry();
    
    // Set up interval
    intervalRef.current = setInterval(fetchDataWithRetry, currentInterval);
  }, [fetchDataWithRetry, currentInterval]);

  // Stop polling
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setIsPolling(false);
  }, []);

  // Toggle polling
  const toggle = useCallback(() => {
    if (isPolling) {
      stop();
    } else {
      start();
    }
  }, [isPolling, start, stop]);

  // Manual refresh
  const refresh = useCallback(async () => {
    setRetryCount(0);
    await fetchDataWithRetry();
  }, [fetchDataWithRetry]);

  // Update interval
  const setIntervalValue = useCallback((newInterval: number) => {
    setCurrentInterval(newInterval);
    
    // Restart polling with new interval if currently active
    if (isPolling) {
      stop();
      setTimeout(start, 0);
    }
  }, [isPolling, start, stop]);

  // Effect to handle enabled/disabled state
  useEffect(() => {
    if (enabled && !isPolling) {
      start();
    } else if (!enabled && isPolling) {
      stop();
    }
  }, [enabled, isPolling, start, stop]);

  // Effect to handle interval changes
  useEffect(() => {
    if (isPolling && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(fetchDataWithRetry, currentInterval);
    }
  }, [currentInterval, fetchDataWithRetry, isPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    isPolling,
    error,
    retryCount,
    start,
    stop,
    toggle,
    refresh,
    setInterval: setIntervalValue
  };
}

// Hook for conditional polling based on visibility
export function useVisibilityAwarePolling<T>(options: UsePollingOptions<T>) {
  const [isVisible, setIsVisible] = useState(true);

  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Use polling with visibility awareness
  const pollingResult = usePolling({
    ...options,
    enabled: options.enabled && isVisible
  });

  return {
    ...pollingResult,
    isVisible
  };
}

// Hook for adaptive polling (adjusts interval based on activity)
export function useAdaptivePolling<T>(
  options: UsePollingOptions<T> & {
    fastInterval?: number;
    slowInterval?: number;
    activityThreshold?: number; // minutes of inactivity before slowing down
  }
) {
  const {
    fastInterval = 5000,
    slowInterval = 30000,
    activityThreshold = 5,
    ...pollingOptions
  } = options;

  const [lastActivity, setLastActivity] = useState(Date.now());
  const [currentInterval, setCurrentInterval] = useState(fastInterval);

  // Track user activity
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  // Adjust polling interval based on activity
  useEffect(() => {
    const checkActivity = () => {
      const timeSinceActivity = Date.now() - lastActivity;
      const inactiveMinutes = timeSinceActivity / (1000 * 60);
      
      const newInterval = inactiveMinutes > activityThreshold ? slowInterval : fastInterval;
      
      if (newInterval !== currentInterval) {
        setCurrentInterval(newInterval);
      }
    };

    const intervalId = setInterval(checkActivity, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [lastActivity, currentInterval, fastInterval, slowInterval, activityThreshold]);

  // Use polling with adaptive interval
  const pollingResult = usePolling({
    ...pollingOptions,
    interval: currentInterval
  });

  return {
    ...pollingResult,
    isSlowMode: currentInterval === slowInterval,
    lastActivity: new Date(lastActivity)
  };
}

// Hook for polling with exponential backoff on errors
export function usePollingWithBackoff<T>(
  options: UsePollingOptions<T> & {
    backoffMultiplier?: number;
    maxBackoffInterval?: number;
  }
) {
  const {
    backoffMultiplier = 2,
    maxBackoffInterval = 60000,
    ...pollingOptions
  } = options;

  const [backoffInterval, setBackoffInterval] = useState(pollingOptions.interval);
  const consecutiveErrorsRef = useRef(0);

  const handleSuccess = useCallback((data: T) => {
    consecutiveErrorsRef.current = 0;
    setBackoffInterval(pollingOptions.interval);
    
    if (pollingOptions.onSuccess) {
      pollingOptions.onSuccess(data);
    }
  }, [pollingOptions]);

  const handleError = useCallback((error: Error) => {
    consecutiveErrorsRef.current += 1;
    
    // Calculate new backoff interval
    const newInterval = Math.min(
      pollingOptions.interval * Math.pow(backoffMultiplier, consecutiveErrorsRef.current),
      maxBackoffInterval
    );
    
    setBackoffInterval(newInterval);
    
    if (pollingOptions.onError) {
      pollingOptions.onError(error);
    }
  }, [pollingOptions, backoffMultiplier, maxBackoffInterval]);

  // Use polling with backoff interval
  const pollingResult = usePolling({
    ...pollingOptions,
    interval: backoffInterval,
    onSuccess: handleSuccess,
    onError: handleError
  });

  return {
    ...pollingResult,
    consecutiveErrors: consecutiveErrorsRef.current,
    currentBackoffInterval: backoffInterval
  };
}
