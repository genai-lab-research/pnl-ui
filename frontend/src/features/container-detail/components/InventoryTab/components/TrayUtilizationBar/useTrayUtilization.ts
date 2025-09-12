import { useState, useEffect, useCallback } from 'react';
import { TrayUtilizationData } from './types';

interface UseTrayUtilizationOptions {
  containerId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onError?: (error: Error) => void;
}

interface UseTrayUtilizationReturn {
  data: TrayUtilizationData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateUtilization: (current: number, total: number) => void;
}

export const useTrayUtilization = ({
  containerId,
  autoRefresh = false,
  refreshInterval = 30000,
  onError,
}: UseTrayUtilizationOptions): UseTrayUtilizationReturn => {
  const [data, setData] = useState<TrayUtilizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateStatus = (percentage: number): TrayUtilizationData['status'] => {
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  };

  const fetchUtilizationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await containerService.getTrayUtilization(containerId);
      
      // Mock data for demonstration
      const mockResponse = {
        current: Math.floor(Math.random() * 100),
        total: 100,
      };
      
      const percentage = Math.round((mockResponse.current / mockResponse.total) * 100);
      
      const utilizationData: TrayUtilizationData = {
        current: mockResponse.current,
        total: mockResponse.total,
        percentage,
        status: calculateStatus(percentage),
        lastUpdated: new Date(),
      };
      
      setData(utilizationData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch utilization data';
      setError(errorMessage);
      onError?.(err as Error);
    } finally {
      setLoading(false);
    }
  }, [containerId, onError]);

  const updateUtilization = useCallback((current: number, total: number) => {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    
    setData({
      current,
      total,
      percentage,
      status: calculateStatus(percentage),
      lastUpdated: new Date(),
    });
  }, []);

  useEffect(() => {
    fetchUtilizationData();
    
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchUtilizationData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchUtilizationData, autoRefresh, refreshInterval]);

  return {
    data,
    loading,
    error,
    refresh: fetchUtilizationData,
    updateUtilization,
  };
};