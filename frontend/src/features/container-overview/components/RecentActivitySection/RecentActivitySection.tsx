import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List,
  ListItem,
  Avatar,
  Skeleton,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import { 
  Person as PersonIcon,
  Computer as SystemIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { recentActivitySectionStyles } from './RecentActivitySection.styles';

interface RecentActivitySectionProps {
  containerId: number;
  isLoading?: boolean;
  onRefresh: () => void;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  containerId,
  isLoading = false,
  onRefresh,
}) => {
  const {
    state,
    // refreshData: refreshActivities,
  } = useActivityLog({
    containerId,
  });

  // Extract data from state
  const activities = state?.activities || [];
  const isActivitiesLoading = state?.isLoading || false;
  const hasError = Boolean(state?.error);
  const errorMessage = state?.error || null;
  const hasMore = false; // Placeholder
  const loadMore = async () => {}; // Placeholder

  const { scrollRef: containerRef, isLoadingMore } = useInfiniteScroll({
    hasMore,
    isLoading: isActivitiesLoading,
    onLoadMore: loadMore,
    threshold: 100,
  });

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        const days = Math.floor(diffInHours / 24);
        return `${days}d ago`;
      }
    } catch {
      return 'Unknown';
    }
  };

  const getActivityIcon = (actorType: string) => {
    switch (actorType.toLowerCase()) {
      case 'user':
        return <PersonIcon />;
      case 'system':
        return <SystemIcon />;
      default:
        return <TimelineIcon />;
    }
  };

  const getActivityColor = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'create':
      case 'start':
        return '#22C55E';
      case 'update':
      case 'modify':
        return '#3B82F6';
      case 'delete':
      case 'stop':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const handleRefresh = () => {
    // refreshActivities();
    onRefresh();
  };

  if (isLoading || (isActivitiesLoading && activities.length === 0)) {
    return (
      <Card sx={recentActivitySectionStyles.card}>
        <CardContent sx={recentActivitySectionStyles.cardContent}>
          <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
          
          <List sx={recentActivitySectionStyles.activityList}>
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItem key={index} sx={recentActivitySectionStyles.activityItem}>
                <Skeleton variant="circular" width={32} height={32} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={16} />
                  <Skeleton variant="text" width="60%" height={14} sx={{ mt: 0.5 }} />
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  if (hasError && activities.length === 0) {
    return (
      <Card sx={recentActivitySectionStyles.card}>
        <CardContent sx={recentActivitySectionStyles.cardContent}>
          <Alert 
            severity="error" 
            action={
              <Button onClick={handleRefresh} size="small">
                Retry
              </Button>
            }
          >
            {errorMessage || 'Failed to load activity log'}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={recentActivitySectionStyles.card}>
      <CardContent sx={recentActivitySectionStyles.cardContent}>
        <Typography variant="h6" sx={recentActivitySectionStyles.title}>
          Recent Activity
        </Typography>

        <Box 
          ref={containerRef}
          sx={recentActivitySectionStyles.scrollContainer}
        >
          {activities.length === 0 ? (
            <Box sx={recentActivitySectionStyles.emptyState}>
              <TimelineIcon sx={recentActivitySectionStyles.emptyIcon} />
              <Typography variant="body2" color="text.secondary">
                No recent activity
              </Typography>
            </Box>
          ) : (
            <List sx={recentActivitySectionStyles.activityList}>
              {activities.map((activity, index) => (
                <React.Fragment key={`${activity.id}-${index}`}>
                  <ListItem sx={recentActivitySectionStyles.activityItem}>
                    <Avatar 
                      sx={{
                        ...recentActivitySectionStyles.activityAvatar,
                        backgroundColor: getActivityColor(activity.action_type),
                      }}
                    >
                      {getActivityIcon(activity.actor_type)}
                    </Avatar>
                    
                    <Box sx={recentActivitySectionStyles.activityContent}>
                      <Typography 
                        variant="body2" 
                        sx={recentActivitySectionStyles.activityDescription}
                      >
                        {activity.description}
                      </Typography>
                      
                      <Box sx={recentActivitySectionStyles.activityMeta}>
                        <Typography 
                          variant="caption" 
                          sx={recentActivitySectionStyles.activityTime}
                        >
                          {formatTimestamp(activity.timestamp)}
                        </Typography>
                        
                        <Typography 
                          variant="caption" 
                          sx={recentActivitySectionStyles.activityActor}
                        >
                          by {activity.actor_type}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  
                  {index < activities.length - 1 && (
                    <Divider sx={recentActivitySectionStyles.activityDivider} />
                  )}
                </React.Fragment>
              ))}
              
              {/* Loading indicator for infinite scroll */}
              {isLoadingMore && (
                <ListItem sx={recentActivitySectionStyles.loadingItem}>
                  <Skeleton variant="circular" width={32} height={32} sx={{ mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="80%" height={16} />
                    <Skeleton variant="text" width="60%" height={14} sx={{ mt: 0.5 }} />
                  </Box>
                </ListItem>
              )}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
