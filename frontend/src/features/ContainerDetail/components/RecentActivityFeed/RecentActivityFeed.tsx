import React, { useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress,
  Button 
} from '@mui/material';
import { ActivityNotificationCard } from '../../../../shared/components/ui/ActivityNotificationCard';
import { ActivityLog } from '../../../../types/containers';
import { styles } from './RecentActivityFeed.styles';

interface RecentActivityFeedProps {
  activities: ActivityLog[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  activities,
  isLoading,
  hasMore,
  onLoadMore,
  onRefresh
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 100 && hasMore && !isLoading) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, onLoadMore]);

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'container_created':
        return '➕';
      case 'container_updated':
        return '✏️';
      case 'metric_recorded':
        return '📊';
      case 'crop_seeded':
        return '🌱';
      case 'maintenance_performed':
        return '🔧';
      default:
        return '📝';
    }
  };

  const getActivityVariant = (actorType: string): 'default' | 'success' | 'warning' | 'error' | 'info' => {
    switch (actorType) {
      case 'user':
        return 'info';
      case 'system':
        return 'success';
      case 'device':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <Paper sx={styles.root}>
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.title}>
          Activity Log
        </Typography>
      </Box>

      <Box ref={scrollContainerRef} sx={styles.scrollContainer}>
        {activities.map((activity) => (
          <Box key={activity.id} sx={styles.activityItem}>
            <ActivityNotificationCard
              avatarIcon={getActivityIcon(activity.action_type)}
              author={activity.actor_id}
              message={activity.description}
              timestamp={formatTimestamp(activity.timestamp)}
              avatarVariant={getActivityVariant(activity.actor_type)}
            />
          </Box>
        ))}

        {isLoading && (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!hasMore && activities.length > 0 && (
          <Typography sx={styles.endMessage}>
            No more activities to load
          </Typography>
        )}

        {activities.length === 0 && !isLoading && (
          <Typography sx={styles.emptyMessage}>
            No activities recorded yet
          </Typography>
        )}
      </Box>
    </Paper>
  );
};