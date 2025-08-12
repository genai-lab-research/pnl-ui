import { useState, useCallback, useEffect } from 'react';
import { containerApiService } from '../../../api/containerApiService';
import { ActivityLog } from '../../../types/containers';

export function useActivityScroll(containerId: number) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 20;

  const loadActivities = useCallback(async (pageNum: number, append = false) => {
    setIsLoadingMore(true);
    try {
      const response = await containerApiService.getActivityLogs(
        containerId,
        pageNum,
        pageSize
      );
      
      if (append) {
        setActivities(prev => [...prev, ...response.activities]);
      } else {
        setActivities(response.activities);
      }
      
      setHasMore(response.activities.length === pageSize);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [containerId]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;
    await loadActivities(page + 1, true);
  }, [hasMore, isLoadingMore, page, loadActivities]);

  const refresh = useCallback(async () => {
    setPage(1);
    setHasMore(true);
    await loadActivities(1, false);
  }, [loadActivities]);

  useEffect(() => {
    loadActivities(1, false);
  }, [loadActivities]);

  return {
    activities,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh
  };
}