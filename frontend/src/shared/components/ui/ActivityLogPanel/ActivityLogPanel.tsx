import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import { ActivityLogPanelProps } from './types';
import { StyledActivityPanel, StyledActivityItem, StyledTimestamp } from './ActivityLogPanel.styles';

/**
 * ActivityLogPanel component for displaying container activity history
 * 
 * @param props - ActivityLogPanel props
 * @returns JSX element
 */
export const ActivityLogPanel: React.FC<ActivityLogPanelProps> = ({
  activities,
  title = 'Activity Log',
  maxHeight = 400,
  loading = false,
  ...props
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' - ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <StyledActivityPanel {...props}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box p={2} textAlign="center">
          <Typography color="textSecondary">Loading activities...</Typography>
        </Box>
      </StyledActivityPanel>
    );
  }

  return (
    <StyledActivityPanel {...props}>
      <Typography variant="h6" gutterBottom fontWeight={700}>
        {title}
      </Typography>
      <Box sx={{ maxHeight, overflowY: 'auto' }}>
        <List disablePadding>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id || index}>
              <StyledActivityItem>
                <Box display="flex" gap={2}>
                  {activity.user && (
                    <Avatar
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        fontSize: '12px',
                        bgcolor: 'primary.main' 
                      }}
                    >
                      {getInitials(activity.user)}
                    </Avatar>
                  )}
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight={500}>
                      {activity.description}
                    </Typography>
                    <StyledTimestamp variant="caption">
                      {formatTimestamp(activity.timestamp)}
                      {activity.user && ` - ${activity.user}`}
                    </StyledTimestamp>
                  </Box>
                </Box>
              </StyledActivityItem>
              {index < activities.length - 1 && (
                <Divider sx={{ my: 1, mx: 2 }} />
              )}
            </React.Fragment>
          ))}
          {activities.length === 0 && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography color="textSecondary" textAlign="center">
                    No recent activities
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Box>
    </StyledActivityPanel>
  );
};

export default ActivityLogPanel;