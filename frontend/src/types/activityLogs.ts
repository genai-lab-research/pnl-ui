/**
 * Activity Logs Data Models
 * Based on p2_datamodels.md and p2_routing.md specifications
 */

// Activity Log Model
export interface ActivityLog {
  id: number;
  container_id: number;
  timestamp: string;
  action_type: ActivityActionType;
  actor_type: ActivityActorType;
  actor_id: string;
  description: string;
  metadata?: Record<string, any>;
  severity?: ActivitySeverity;
  related_entities?: RelatedEntity[];
}

// Activity Action Types
export type ActivityActionType = 
  | 'container_created'
  | 'container_updated'
  | 'container_deleted'
  | 'container_started'
  | 'container_stopped'
  | 'device_connected'
  | 'device_disconnected'
  | 'device_calibrated'
  | 'sensor_reading'
  | 'alert_triggered'
  | 'alert_resolved'
  | 'crop_planted'
  | 'crop_transplanted'
  | 'crop_harvested'
  | 'irrigation_started'
  | 'irrigation_stopped'
  | 'light_adjusted'
  | 'temperature_adjusted'
  | 'nutrient_added'
  | 'pest_treatment'
  | 'maintenance_performed'
  | 'user_login'
  | 'user_logout'
  | 'configuration_changed'
  | 'backup_created'
  | 'data_export'
  | 'system_error'
  | 'manual_intervention';

// Activity Actor Types
export type ActivityActorType = 
  | 'user'
  | 'system'
  | 'device'
  | 'automation'
  | 'external_service'
  | 'scheduled_task'
  | 'api_client';

// Activity Severity Levels
export type ActivitySeverity = 
  | 'info'
  | 'warning'
  | 'error'
  | 'critical';

// Related Entity Reference
export interface RelatedEntity {
  entity_type: 'container' | 'device' | 'crop' | 'tray' | 'panel' | 'user' | 'alert';
  entity_id: string | number;
  entity_name?: string;
  relationship: 'primary' | 'secondary' | 'affected' | 'triggered_by';
}

// Request types for API operations
export interface CreateActivityLogRequest {
  container_id: number;
  action_type: ActivityActionType;
  actor_type: ActivityActorType;
  actor_id: string;
  description: string;
  metadata?: Record<string, any>;
  severity?: ActivitySeverity;
  related_entities?: RelatedEntity[];
}

// Filter and query parameters
export interface ActivityLogFilterCriteria {
  container_id?: number;
  action_type?: ActivityActionType | ActivityActionType[];
  actor_type?: ActivityActorType | ActivityActorType[];
  actor_id?: string;
  severity?: ActivitySeverity | ActivitySeverity[];
  start_date?: string;
  end_date?: string;
  related_entity_type?: string;
  related_entity_id?: string | number;
  skip?: number;
  limit?: number;
  sort?: 'timestamp' | 'action_type' | 'severity';
  order?: 'asc' | 'desc';
}

// Response types
export interface ActivityLogListResponse {
  activity_logs: ActivityLog[];
  total: number;
  skip: number;
  limit: number;
  filters_applied: ActivityLogFilterCriteria;
}

// Activity summary and analytics
export interface ActivitySummary {
  container_id?: number;
  date_range: {
    start: string;
    end: string;
  };
  total_activities: number;
  by_action_type: Record<ActivityActionType, number>;
  by_actor_type: Record<ActivityActorType, number>;
  by_severity: Record<ActivitySeverity, number>;
  most_active_actors: Array<{
    actor_id: string;
    actor_type: ActivityActorType;
    activity_count: number;
  }>;
  activity_timeline: ActivityTimelineEntry[];
}

export interface ActivityTimelineEntry {
  timestamp: string;
  activity_count: number;
  critical_count: number;
  error_count: number;
  warning_count: number;
}

// Activity trends and patterns
export interface ActivityTrends {
  container_id?: number;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  trends: Array<{
    period_start: string;
    total_activities: number;
    average_activities_per_hour?: number;
    peak_activity_hour?: number;
    dominant_action_types: ActivityActionType[];
    error_rate: number;
  }>;
  anomalies: ActivityAnomaly[];
}

export interface ActivityAnomaly {
  timestamp: string;
  anomaly_type: 'spike' | 'drop' | 'unusual_pattern' | 'error_cluster';
  description: string;
  severity: 'low' | 'medium' | 'high';
  affected_metrics: string[];
  suggested_actions?: string[];
}

// Activity audit trail
export interface ActivityAuditTrail {
  entity_type: 'container' | 'device' | 'crop' | 'user';
  entity_id: string | number;
  activities: ActivityLog[];
  summary: {
    first_activity: string;
    last_activity: string;
    total_activities: number;
    critical_events: number;
  };
}

// Real-time activity feed
export interface ActivityFeedItem {
  id: number;
  timestamp: string;
  action_type: ActivityActionType;
  actor_name: string;
  container_name: string;
  description: string;
  severity: ActivitySeverity;
  is_read: boolean;
  related_url?: string;
}

export interface ActivityFeedResponse {
  feed_items: ActivityFeedItem[];
  total_unread: number;
  last_updated: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Activity notification settings
export interface ActivityNotificationSettings {
  user_id: string;
  container_filters: number[];
  action_type_filters: ActivityActionType[];
  severity_filters: ActivitySeverity[];
  notification_methods: Array<'email' | 'push' | 'sms' | 'webhook'>;
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
    timezone: string;
  };
  digest_settings: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly';
    time: string;
  };
}
