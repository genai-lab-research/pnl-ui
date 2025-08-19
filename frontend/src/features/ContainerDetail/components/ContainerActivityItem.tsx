import React from 'react';
import { ActivityCard } from '../../../shared/components/ui';
import { ContainerActivityItemProps } from '../types/ui-models';

/**
 * ContainerActivityItem - Domain component for displaying container activity timeline entries
 * 
 * This component wraps the ActivityCard atomic component to display container-specific
 * activity events such as environment mode changes, system notifications, and user actions
 * within the container management context.
 * 
 * Features:
 * - Container-specific activity display
 * - User avatar with default person icon
 * - Timestamp and author information
 * - Environment status messages
 * - Consistent styling with container theme
 */
export const ContainerActivityItem: React.FC<ContainerActivityItemProps> = ({
  activity,
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  onClick,
  className,
  ...props
}) => {
  // Safety checks for activity data
  if (!activity) {
    return null;
  }

  const title = activity.message || activity.description || 'Activity';
  const author = activity.author || activity.actorId || 'System';
  const subtitle = activity.category || activity.actionType || 'activity';

  return (
    <ActivityCard
      title={title}
      timestamp={activity.timestamp}
      author={author}
      subtitle={subtitle}
      avatarColor="#489F68"
      variant={variant}
      size={size}
      loading={loading}
      error={error}
      onClick={onClick}
      className={className}
      showTimestampIcon={true}
      ariaLabel={`Container activity: ${title} by ${author} at ${activity.timestamp}`}
      {...props}
    />
  );
};

export type { ContainerActivityItemProps };