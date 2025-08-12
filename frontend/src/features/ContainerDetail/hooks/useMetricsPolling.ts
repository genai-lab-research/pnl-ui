import { useState, useEffect, useCallback, useRef } from 'react';
import { containerApiService, DashboardMetrics } from '../../../api/containerApiService';
import { TimePeriod } from '../types/container-detail';

interface UseMetricsPollingOptions {
  enabled?: boolean;
  intervalMs?: number;
}

export function useMetricsPolling(
  containerId: number,
  timePeriod: TimePeriod,
  options: UseMetricsPollingOptions = {}
) {
  const { enabled = true, intervalMs = 30000 } = options;
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await containerApiService.getContainerOverview(
        containerId,
        timePeriod,
        timePeriod === 'week' ? 'day' : 'week'
      );
      setMetrics(response.dashboard_metrics);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  }, [containerId, timePeriod]);

  const startPolling = useCallback(() => {
    if (!enabled || intervalRef.current) return;
    
    setIsPolling(true);
    fetchMetrics();
    
    intervalRef.current = setInterval(() => {
      fetchMetrics();
    }, intervalMs);
  }, [enabled, intervalMs, fetchMetrics]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    metrics,
    isPolling,
    startPolling,
    stopPolling
  };
}