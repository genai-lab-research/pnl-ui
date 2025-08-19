// Real-time Metrics Hook - Manages live metric updates and polling
import { useState, useEffect, useCallback, useRef } from 'react';
import { metricsPollingService } from '../services';
import { MetricSnapshot } from '../../../types/containers';
import { MetricPollingConfig } from '../types';

/**
 * Hook for real-time metrics management
 */
export function useRealTimeMetrics(
  containerId: number,
  enabled: boolean = true,
  pollingConfig?: Partial<MetricPollingConfig>
) {
  const [isPolling, setIsPolling] = useState(false);
  const [latestMetrics, setLatestMetrics] = useState<MetricSnapshot[]>([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  
  const unsubscribeCallbacksRef = useRef<Array<() => void>>([]);

  // Start/stop polling based on enabled flag
  useEffect(() => {
    if (enabled && containerId) {
      startRealTimeMonitoring();
    } else {
      stopRealTimeMonitoring();
    }

    return () => {
      stopRealTimeMonitoring();
    };
  }, [enabled, containerId]);

  // Update polling configuration
  useEffect(() => {
    if (isPolling && pollingConfig) {
      metricsPollingService.updateConfig(pollingConfig);
    }
  }, [pollingConfig, isPolling]);

  // Start real-time monitoring
  const startRealTimeMonitoring = useCallback(() => {
    if (isPolling) return;

    setError(null);
    setConnectionStatus('connected');
    
    // Start polling service
    metricsPollingService.startPolling(containerId, pollingConfig);
    
    // Subscribe to metrics updates
    const unsubscribeMetrics = metricsPollingService.subscribe((metrics) => {
      setLatestMetrics(metrics);
      setUpdateCount(prev => prev + 1);
      setLastUpdate(new Date().toISOString());
      setConnectionStatus('connected');
      setError(null);
    });

    // Subscribe to error notifications
    const unsubscribeErrors = metricsPollingService.subscribeToErrors((error) => {
      setError(error.message);
      setConnectionStatus('error');
    });

    // Store unsubscribe functions
    unsubscribeCallbacksRef.current = [unsubscribeMetrics, unsubscribeErrors];
    
    setIsPolling(true);
  }, [containerId, pollingConfig, isPolling]);

  // Stop real-time monitoring
  const stopRealTimeMonitoring = useCallback(() => {
    if (!isPolling) return;

    // Unsubscribe from all callbacks
    unsubscribeCallbacksRef.current.forEach(unsubscribe => unsubscribe());
    unsubscribeCallbacksRef.current = [];

    // Stop polling service
    metricsPollingService.stopPolling();
    
    setIsPolling(false);
    setConnectionStatus('disconnected');
  }, [isPolling]);

  // Force an immediate update
  const forceUpdate = useCallback(async () => {
    if (!isPolling) return;

    try {
      setError(null);
      await metricsPollingService.forceUpdate();
    } catch (error: any) {
      setError(error.message || 'Failed to update metrics');
    }
  }, [isPolling]);

  // Update polling configuration
  const updatePollingConfig = useCallback((newConfig: Partial<MetricPollingConfig>) => {
    metricsPollingService.updateConfig(newConfig);
  }, []);

  // Get current polling state
  const getPollingState = useCallback(() => {
    return metricsPollingService.getState();
  }, []);

  // Get latest metric values
  const getCurrentMetrics = useCallback(() => {
    if (latestMetrics.length === 0) return null;
    
    // Return the most recent metric snapshot
    return latestMetrics[latestMetrics.length - 1];
  }, [latestMetrics]);

  // Get metric trends (compare current vs previous)
  const getMetricTrends = useCallback(() => {
    if (latestMetrics.length < 2) return null;
    
    const current = latestMetrics[latestMetrics.length - 1];
    const previous = latestMetrics[latestMetrics.length - 2];
    
    return {
      airTemperature: {
        current: current.air_temperature,
        previous: previous.air_temperature,
        change: current.air_temperature - previous.air_temperature,
        trend: current.air_temperature > previous.air_temperature ? 'up' : 
               current.air_temperature < previous.air_temperature ? 'down' : 'stable',
      },
      humidity: {
        current: current.humidity,
        previous: previous.humidity,
        change: current.humidity - previous.humidity,
        trend: current.humidity > previous.humidity ? 'up' : 
               current.humidity < previous.humidity ? 'down' : 'stable',
      },
      co2: {
        current: current.co2,
        previous: previous.co2,
        change: current.co2 - previous.co2,
        trend: current.co2 > previous.co2 ? 'up' : 
               current.co2 < previous.co2 ? 'down' : 'stable',
      },
      yield: {
        current: current.yield_kg,
        previous: previous.yield_kg,
        change: current.yield_kg - previous.yield_kg,
        trend: current.yield_kg > previous.yield_kg ? 'up' : 
               current.yield_kg < previous.yield_kg ? 'down' : 'stable',
      },
      spaceUtilization: {
        current: current.space_utilization_pct,
        previous: previous.space_utilization_pct,
        change: current.space_utilization_pct - previous.space_utilization_pct,
        trend: current.space_utilization_pct > previous.space_utilization_pct ? 'up' : 
               current.space_utilization_pct < previous.space_utilization_pct ? 'down' : 'stable',
      },
    };
  }, [latestMetrics]);

  // Check if data is fresh
  const isDataFresh = useCallback((maxAgeMinutes: number = 2) => {
    if (!lastUpdate) return false;
    
    const lastUpdateTime = new Date(lastUpdate).getTime();
    const now = Date.now();
    const ageMinutes = (now - lastUpdateTime) / (1000 * 60);
    
    return ageMinutes <= maxAgeMinutes;
  }, [lastUpdate]);

  // Get data freshness info
  const getDataFreshness = useCallback(() => {
    if (!lastUpdate) {
      return {
        lastUpdate: null,
        ageMinutes: 0,
        isFresh: false,
        isStale: true,
      };
    }

    const lastUpdateTime = new Date(lastUpdate).getTime();
    const now = Date.now();
    const ageMinutes = (now - lastUpdateTime) / (1000 * 60);

    return {
      lastUpdate: lastUpdate,
      ageMinutes: Math.round(ageMinutes * 10) / 10,
      isFresh: ageMinutes <= 2,
      isStale: ageMinutes > 5,
    };
  }, [lastUpdate]);

  // Format last update time for display
  const getLastUpdateFormatted = useCallback(() => {
    if (!lastUpdate) return 'Never';
    
    const date = new Date(lastUpdate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    return date.toLocaleTimeString();
  }, [lastUpdate]);

  return {
    // Control actions
    startRealTimeMonitoring,
    stopRealTimeMonitoring,
    forceUpdate,
    updatePollingConfig,
    
    // State
    isPolling,
    connectionStatus,
    error,
    updateCount,
    lastUpdate,
    
    // Data
    latestMetrics,
    currentMetrics: getCurrentMetrics(),
    metricTrends: getMetricTrends(),
    
    // Data freshness
    dataFreshness: getDataFreshness(),
    isDataFresh: isDataFresh(),
    lastUpdateFormatted: getLastUpdateFormatted(),
    
    // Polling state
    pollingState: getPollingState(),
    
    // Status checks
    isConnected: connectionStatus === 'connected',
    hasError: !!error,
    hasData: latestMetrics.length > 0,
    hasTrends: latestMetrics.length >= 2,
    
    // Utility
    canForceUpdate: isPolling && !error,
    showRealTimeIndicator: isPolling && connectionStatus === 'connected',
    showErrorIndicator: !!error,
    showDataAge: !!lastUpdate,
  };
}
