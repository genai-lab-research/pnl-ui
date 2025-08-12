import { useState, useEffect, useCallback } from 'react';
import { containerApiService, ContainerOverviewResponse } from '../../../api/containerApiService';
import { ContainerDetailData, TimePeriod } from '../types/container-detail';

export function useContainerData(containerId: number, timePeriod: TimePeriod) {
  const [containerData, setContainerData] = useState<ContainerDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContainerData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ContainerOverviewResponse = await containerApiService.getContainerOverview(
        containerId,
        timePeriod,
        timePeriod === 'week' ? 'day' : 'week'
      );

      // Transform snake_case to camelCase for frontend consistency
      const transformedMetrics = response.dashboard_metrics ? {
        air_temperature: response.dashboard_metrics.air_temperature,
        humidity: response.dashboard_metrics.humidity,
        co2: response.dashboard_metrics.co2,
        yield: response.dashboard_metrics.yield,
        space_utilization: response.dashboard_metrics.space_utilization
      } : null;

      setContainerData({
        container: response.container,
        dashboardMetrics: transformedMetrics as any, // Type will match DashboardMetrics
        cropsSummary: response.crops_summary,
        recentActivity: response.recent_activity,
        isLoading: false,
        error: null
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch container data');
      setContainerData(null);
    } finally {
      setIsLoading(false);
    }
  }, [containerId, timePeriod]);

  const refreshData = useCallback(() => {
    return fetchContainerData();
  }, [fetchContainerData]);

  useEffect(() => {
    fetchContainerData();
  }, [fetchContainerData]);

  return {
    containerData,
    isLoading,
    error,
    refreshData
  };
}